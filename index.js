const notionRequire = require("@notionhq/client")
const Client = notionRequire.Client
const googleRequire = require("@googlemaps/google-maps-services-js");
const GoogleClient = googleRequire.Client;
const dotenv = require("dotenv")

dotenv.config()

const databaseId = process.env.NOTION_DATABASE_ID
const notion = new Client({ auth: process.env.SECRET_TOKEN })
const google = new GoogleClient({});

const pageToLocation = {};

const getPropertyValue = async ({ pageId, propertyId }) => {
  const propertyItem = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: propertyId,
  })
  if (propertyItem.object === "property_item") {
    return propertyItem
  }

  // Property is paginated.
  let nextCursor = propertyItem.next_cursor
  const results = propertyItem.results

  while (nextCursor !== null) {
    const propertyItem = await notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
      start_cursor: nextCursor,
    })

    nextCursor = propertyItem.next_cursor
    results.push(...propertyItem.results)
  }

  return results
}

getSummitsFromDb = async () => {
  console.log(`=> Loading cims database ${databaseId}...`)

  const pages = [];

  const { results } = await notion.databases.query({
    database_id: databaseId,
  });
  pages.push(...results);

  const summits = [];

  for (const page of pages) {
    const pageId = page.id;

    const namePropertyId = page.properties["Name"].id;
    const namePropertyItems = await getPropertyValue({
      pageId,
      propertyId: namePropertyId,
    });
    const name = namePropertyItems
      .map(propertyItem => propertyItem.title.plain_text)
      .join("")

    summits.push({ pageId, name });
  }

  return summits;
}

const getLocation = async (name) => {
  console.log(`   * ${name}`)

  const queryParams = {
    input: name,
    inputtype: "textquery",
    key: process.env.GOOGLE_MAPS_API_KEY,
    fields: ["place_id"],
  }

  let placeId;

  try {
    const response = await google.findPlaceFromText({ params: queryParams })
    placeId = response.data.candidates[0].place_id;

    if (!placeId) { return; }
  } catch (error) {
    console.log("Error querying text")
    console.log(error.response.data.error_message);
  }

  try {
    const placeParams = {
      place_id: placeId,
      key: process.env.GOOGLE_MAPS_API_KEY,
      fields: ["formatted_address", "url", "types", "geometry"]
    };
    const result = await google.placeDetails({ params: placeParams });
    return result.data.result;
  } catch (error) {
    console.log("Error finding location")
    console.log(error);
  }
}

do_thing = async () => {
  const summits = await getSummitsFromDb();

  console.log(`=> Searching locations...`)

  for (const { pageId, name } of summits) {
    const location = await getLocation(name)
    console.log("\t", location);
    pageToLocation[pageId] = location;
  }
}

do_thing();

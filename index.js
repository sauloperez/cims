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
  const params = {
    input: name,
    inputtype: "textquery",
    key: process.env.GOOGLE_MAPS_API_KEY,
    fields: ["place_id", "name", "formatted_address", "type", "geometry"],
  }
  const response = await google.findPlaceFromText({ params})
  return response.data.candidates[0];
}

do_thing = async () => {
  const summits = await getSummitsFromDb();
  for (const { pageId, name } of summits) {
    pageToLocation[pageId] = await getLocation(name);
  }
}

// do_thing().then(() => console.log(pageToLocation));

const queryParams = {
  input: "Piz Buin",
  inputtype: "textquery",
  key: process.env.GOOGLE_MAPS_API_KEY,
  fields: ["place_id"],
}
google
  .findPlaceFromText({ params: queryParams })
  .then((r) => (r.data.candidates[0].place_id))
  .then((place_id) => {
    const placeParams = {
      place_id,
      key: process.env.GOOGLE_MAPS_API_KEY,
      fields: ["formatted_address", "url", "types", "geometry"]
    };
    google.placeDetails({ params: placeParams }).then((r) => {
      console.log(r.data.result);
    });
  });

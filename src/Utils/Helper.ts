export const customArgsQueryBuilder = (customQuery: any, query: any) => {
  if (Object.keys(customQuery).length > 0) {
    let subQuery: any = {};
    for (const key in customQuery) {
      subQuery["customArgs." + key] = customQuery[key];
    }
    query = {
      ...query,
      ...subQuery,
    };
  }
  return query;
};

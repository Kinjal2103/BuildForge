class APIFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.search || this.queryString.keyword;
    if (keyword) {
      const regexSearch = {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { brand: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      };
      this.mongooseQuery = this.mongooseQuery.find(regexSearch);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword', 'search', 'getFilters'];
    excludedFields.forEach((field) => delete queryObj[field]);

    const mongoQuery = {};

    // 1. Handle price range (supports price[gte]/price[lte] and minPrice/maxPrice)
    if (queryObj.price) {
      const priceQuery = {};
      for (const key in queryObj.price) {
        if (['gte', 'gt', 'lte', 'lt'].includes(key)) {
          priceQuery[`$${key}`] = Number(queryObj.price[key]);
        }
      }
      if (Object.keys(priceQuery).length > 0) {
        mongoQuery.price = priceQuery;
      }
      delete queryObj.price;
    } else if (queryObj.minPrice !== undefined || queryObj.maxPrice !== undefined) {
      mongoQuery.price = {};
      if (queryObj.minPrice !== undefined && queryObj.minPrice !== '') {
        mongoQuery.price.$gte = Number(queryObj.minPrice);
      }
      if (queryObj.maxPrice !== undefined && queryObj.maxPrice !== '') {
        mongoQuery.price.$lte = Number(queryObj.maxPrice);
      }
      if (Object.keys(mongoQuery.price).length === 0) {
        delete mongoQuery.price;
      }
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    // 2. Handle rating
    if (queryObj.rating !== undefined && queryObj.rating !== '') {
      mongoQuery.rating = { $gte: Number(queryObj.rating) };
      delete queryObj.rating;
    }

    // 3. Handle stock status
    if (queryObj.stock === 'true' || queryObj.stock === true || queryObj.inStockOnly === 'true' || queryObj.inStockOnly === true) {
      mongoQuery.stock = { $gt: 0 };
      delete queryObj.stock;
      delete queryObj.inStockOnly;
    }

    // 4. Process all remaining parameters
    for (const key in queryObj) {
      const val = queryObj[key];
      if (val === undefined || val === null || val === '') continue;

      let dbField = key;
      if (key === 'socket') {
        dbField = 'specs.Socket Type';
      } else if (key === 'ramType') {
        dbField = 'ramType';
      } else if (key === 'vram') {
        dbField = 'specs.VRAM';
      } else if (key === 'capacity') {
        dbField = 'specs.Capacity';
      } else if (key === 'rgb') {
        dbField = 'specs.rgb';
      }

      if (typeof val === 'object' && val !== null) {
        const opQuery = {};
        for (const op in val) {
          if (['gte', 'gt', 'lte', 'lt'].includes(op)) {
            opQuery[`$${op}`] = Number(val[op]);
          }
        }
        mongoQuery[dbField] = opQuery;
      } else {
        const valStr = String(val).trim();
        if (valStr === 'All') continue;

        if (dbField === 'specs.rgb') {
          if (valStr === 'Yes') {
            mongoQuery[dbField] = { $exists: true, $ne: false, $ne: null };
          } else if (valStr === 'No') {
            mongoQuery.$or = mongoQuery.$or || [];
            mongoQuery.$or.push(
              { 'specs.rgb': false },
              { 'specs.rgb': null },
              { 'specs.rgb': { $exists: false } }
            );
          }
          continue;
        }

        const values = valStr.split(',').map(v => v.trim()).filter(Boolean);
        if (values.length === 0) continue;

        if (dbField === 'ramType') {
          const orConditions = [];
          values.forEach(v => {
            const regex = new RegExp(v, 'i');
            orConditions.push(
              { 'specs.Type': regex },
              { 'specs.RAM Slots': regex },
              { 'specs.RAM Support': regex }
            );
          });
          if (orConditions.length > 0) {
            mongoQuery.$or = mongoQuery.$or || [];
            mongoQuery.$or.push(...orConditions);
          }
        } else if (dbField === 'specs.VRAM' || dbField === 'specs.Capacity') {
          const orConditions = values.map(v => ({
            [dbField]: { $regex: v, $options: 'i' }
          }));
          if (orConditions.length === 1) {
            mongoQuery[dbField] = orConditions[0][dbField];
          } else {
            mongoQuery.$or = mongoQuery.$or || [];
            mongoQuery.$or.push(...orConditions);
          }
        } else {
          if (values.length > 1) {
            mongoQuery[dbField] = { $in: values };
          } else {
            let parsedVal = values[0];
            if (parsedVal === 'true') parsedVal = true;
            else if (parsedVal === 'false') parsedVal = false;
            mongoQuery[dbField] = parsedVal;
          }
        }
      }
    }

    this.mongooseQuery = this.mongooseQuery.find(mongoQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skipVal = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skipVal).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

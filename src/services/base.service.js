class BaseService {
  constructor(modelClass) {
    this.modelClass = modelClass;
  }

  dataStore = async (data) => {
    return await this.modelClass.create(data);
  };

  getSingleRowByFilter = async (filter) => {
    return await this.modelClass.findOne(filter);
  };

  updateOneRowByFilter = async (filter, data) => {
    return await this.modelClass.findOneAndUpdate(
      filter,
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );
  };
}

module.exports = BaseService;
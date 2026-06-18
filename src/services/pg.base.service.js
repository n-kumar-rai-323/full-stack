class BaseService {
  #modelClass;

  constructor(_modelClass) {
    this.#modelClass = _modelClass;
  }

  dataStore = async (data) => {
    return await this.#modelClass.create(data);
  };

  getSingleRowByFilter = async (filter) => {
    return await this.#modelClass.findOne({
      where: filter,
    });
  };

  updateOneRowByFilter = async (filter, data) => {
    await this.#modelClass.update(data, {
      where: filter,
    });

    return await this.#modelClass.findOne({
      where: filter,
    });
  };
}

module.exports = BaseService;
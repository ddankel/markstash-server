class ErrorThrowingService {
  async call(args) {
    throw new Error();
  }
}

module.exports = ErrorThrowingService;

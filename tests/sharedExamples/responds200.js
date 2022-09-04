const sharedExamples = () => {
  it("responds 200 OK", () => {
    expect(response.statusCode).toBe(200);
  });
};

module.exports = sharedExamples;

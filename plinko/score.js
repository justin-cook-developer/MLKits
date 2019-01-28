// [ dropPosition, bounciness, size, bucketLabel ]
const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const k = 10;

  _.range(0, 3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last(row)]);
    const [testData, trainingData] = shuffleDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testData)
      .filter(testPoint => knn(trainingData, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

    console.log(`For feature of ${feature} Accuracy is, ${accuracy}`);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => {
      return [
        distance(_.initial(row), point),
        _.last(row)
      ]
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
}

function shuffleDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testData = _.slice(shuffled, 0, testCount);
  const trainingData = _.slice(shuffled, testCount);

  return [testData, trainingData];
}

function minMax(data, featureCount) {
  const cloneData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = _.map(cloneData, row => row[i]);
    const minimum = _.min(column);
    const maximum = _.max(column);

    for (let j = 0; j < cloneData.length; j++) {
      cloneData[j][i] = (cloneData[j][i] - minimum) / (maximum - minimum)
    }
  }

  return cloneData;
}

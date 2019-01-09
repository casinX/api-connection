const defaultParser = (data) => {
  return data;
};


const normalize = ({
  array,
  key='id',
  parser=defaultParser,
}) => {
  const entities = {};

  const keys = array.map(item => {
    const parsedItem = parser(item);
    entities[parsedItem[key]] = parsedItem;
    return parsedItem[key];
  });

  return [
    entities,
    keys,
  ]
};


export default normalize;
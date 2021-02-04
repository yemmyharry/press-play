let formattedDate = (dateString) => {
  let date = new Date(dateString);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
    date
  );
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return `${day}-${month}-${year}`;
};

function updateObject(objectToCompare, objectToUpdate) {
  objectToUpdateProps = Object.keys(objectToUpdate);
  for (let property in objectToCompare) {
    if (
      property === "_id" ||
      property === "createdAt" ||
      property === "updatedAt"
    )
      continue;
    if (objectToUpdateProps.includes(property))
      objectToUpdate[property] = objectToCompare[property];
  }

  return objectToUpdate;
}

exports.formattedDate = formattedDate;
exports.updateObject = updateObject;

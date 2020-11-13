import classnames from "classnames";
import { useField } from "formik";
import React from "react";

const removeItemFromArray = (items, value, isIndex = false) => {
  const clonedItems = [...items];
  const index = isIndex ? value : clonedItems.indexOf(value);

  if (index === -1) return false;

  clonedItems.splice(index, 1);

  return clonedItems;
};

const ItemBadgeList = ({ items, onDelete }) => {
  return (
    <>
      {items && items.length
        ? items.map(item => (
            <div
              key={item}
              className="flex rounded bg-gray-400 text-gray-600 p-2 mt-2 ml-2"
            >
              <div>{item}</div>
              <div className="flex items-center ml-2">
                <div
                  className="rounded-full bg-gray-200 flex justify-center items-center"
                  style={{ width: `1rem`, height: `1rem` }}
                  onClick={onDelete}
                  data-value={item}
                >
                  x
                </div>
              </div>
            </div>
          ))
        : null}
    </>
  );
};

const BadgeInputField = ({
  isEditable,
  items: initialItems = [],
  onBadgeChange,
  onInputChange,
  className,
  name,
  ...props
}) => {
  const [items, setItems] = React.useState(initialItems);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (typeof onBadgeChange === "function") {
      onBadgeChange(items);
    }
  }, [items]);

  React.useEffect(() => {
    if (typeof onInputChange === "function") {
      onInputChange(value);
    }
  }, [value]);

  return (
    <div className="flex flex-wrap bg-gray-200 pb-2 pr-2">
      <ItemBadgeList
        items={items}
        onDelete={e => setItems(removeItemFromArray(items, e.target.value))}
      />
      {isEditable ? (
        <input
          {...props}
          type="text"
          name={name}
          className={classnames("p-0 mt-2 ml-2 flex-grow", className)}
          onKeyUp={e => {
            if (e.key === `Enter`) {
              if (!items.includes(e.target.value)) {
                setItems([...items, value]);
              }

              setValue("");
            }
          }}
          onKeyDown={e =>
            e.key === `Enter`
              ? e.preventDefault()
              : e.key === `Backspace` &&
                e.target.value === "" &&
                setItems(removeItemFromArray(items, items.length - 1, true))
          }
          onChange={e => setValue(e.target.value)}
          value={value}
          style={{ minWidth: `20px` }}
        />
      ) : null}
    </div>
  );
};

export default function IngredientsField({ ingredients, isEditable, name }) {
  const [_, __, helpers] = useField(name);

  return (
    <BadgeInputField
      items={ingredients}
      isEditable={isEditable}
      onBadgeChange={items => helpers.setValue(items)}
      onInputChange={value => console.log(`input change: `, value)}
    />
  );
}

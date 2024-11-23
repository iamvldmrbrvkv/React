//Функции getList и setList - не требуют изменений

import React, { useState, useEffect, useRef } from "react";

function getList() {
  //Код функции не требует изменений
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(
        Array.from({ length: 10 }, (_el, index) => ({
          label: `label ${index + 1}`,
          checked: false,
          id: index
        }))
      );
    }, 1000);
  });
}

function setList(list) {
  //Код функции не требует изменений
}

const Row = ({ label, checked, id, handleChange }) => {
  const renders = useRef(0);
  console.log('renders.current', renders.current)

  return (
    <div>
      {label}

      {` (${renders.current++}) `}
      <input
        type="checkbox"
        checked={checked}
        onChange={() => handleChange(id)}
      />
    </div>
  );
};

const List = ({ list }) => {
  if (list.length === 0) {
    return <div>LOADING...</div>;
  }

  // лист в локальный лист теперь у листа свое состояние если оно изменится компонент перерисуется
  const [localList, setLocalList] = useState(null);

  const handleChange = (id) => {
    setLocalList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );    
  };

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  return (
    <>
      {localList?.map(item => {
        const { label, checked, id } = item
        return <Row key={id} label={label} checked={checked} id={id} handleChange={handleChange} />
      })}
    </>
  );
};

const Test = () => {
  const [listRow, setListRow] = useState([]);

  useEffect(() => {
    getList().then((res) => {
      setListRow(res);
    });
  }, []);

  return (
    <div className="test">
      <h1>Test</h1>
      <List list={listRow} />
      {console.log('listRow', listRow)}
    </div>
  );
};

// Test.defaultProps = {};

export default Test;

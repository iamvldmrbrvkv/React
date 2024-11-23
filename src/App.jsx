// первое оригинальное решение

/* //Функции getList и setList - не требуют изменений

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

  if (list.length === 0) {
    return <div>LOADING...</div>;
  }

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
    </div>
  );
};

export default Test;
 */

// задание со звездочкой

// Решение
// 1. Обернуть handleChange в useCallback чтобы кешировать фукнцию, так как при изменении стейта localList происходил ререндер компонента List и фунция handleChange создавалась заново
// 2. Обернуть в memo компонент Row чтобы перерисовке родительского компонента List ререндерились только те компоненты Row которые получили новые пропсы, в нашем случае новым пропсом может быть только checked
// 3. Так как мы передаем handleChange как пропс в Row, этот пропс вызывал бы перерисовку всех Row, но мы ее кешировали с помошью useCallback это будет одна и та же неизменная handleChange которая не приведет к ререндеру Row


//Функции getList и setList - не требуют изменений

import React, { useState, useEffect, useRef, useCallback, memo } from "react";

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

const Row = memo(function Row({ label, checked, id, handleChange }) {
  const renders = useRef(0)

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
});

const List = ({ list }) => {
  const [localList, setLocalList] = useState([]);
  
  const handleChange = useCallback((id) => {
    setLocalList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );    
  }, []);

  useEffect(() => {
    setLocalList(list);
  }, [list]);

  if (list.length === 0) {
    return <div>LOADING...</div>;
  }

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
    </div>
  );
};

export default Test;

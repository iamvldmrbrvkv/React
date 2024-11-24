/* Задание:

1. Починить чекбоксы

2. Починить отображение количества рендеров в круглых скобках в названии чекбокса

3. Исправить ошибки в коде

Задание со звездочкой: Сделать так чтобы ререндер происходил только у изменяемого элемента или предложить в комментарии в коде или в ответном письме варианты как этого можно достичь.

Комментарий: На вкладке Problems должно быть пусто и в решении не должно быть неиспользованных функций. */

//Функции getList и setList - не требуют изменений

/* import React, { useState, useEffect, useRef } from "react";

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
// не нужная функция
function setList(list) {
  //Код функции не требует изменений
}

const Row = (props) => {
  const renders = useRef(0);
  // дублированная не нужная функция
  const handleChange = (id) => {
    props.handleChange(id);
  };

  const { label, checked, id } = props;

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
  // все эффекты должны быть на верхнем уровне компонента до ретернов
  const [localList, setLocalList] = useState(null);
  // мутируем стейт что не допустимо
  const handleChange = (id) => {
    localList[id].checked = !localList[id].checked;
  };
  // не нужный эффект
  useEffect(() => {
    setList(localList);
  });
  // нет зависимости list в эффекте, соответвенно будет каждый раз запускаться и ререндерить компонент List
  useEffect(() => {
    setLocalList(list);
  });

  return (
    <>
      {localList?.map((item) => (
        <Row {...item} handleChange={handleChange} />
      ))}
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
    <div class="test">
      <h1>Test</h1>
      <List list={listRow} />
    </div>
  );
};

Test.defaultProps = {};

export default Test; */

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

/* Решение
1. Обернуть handleChange в useCallback чтобы кешировать функцию, так как при изменении стейта localList происходил ререндер компонента List и функция handleChange создавалась заново
2. Обернуть в memo компонент Row чтобы перерисовке родительского компонента List ререндерились только те компоненты Row которые получили новые пропсы, в нашем случае новым пропсом может быть только checked
3. Так как мы передаем handleChange как пропс в Row, этот пропс вызывал бы перерисовку всех Row, но мы ее кешировали с помошью useCallback это будет одна и та же неизменная handleChange которая не приведет к ререндеру Row */


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
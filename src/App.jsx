// import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "./axios/api";

function App() {
  //받아온 데이터를 사용하기 위해서 state 만들어주기
  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState({
    title: "",
  });

  const [targetId, setTargetId] = useState("");
  const [content, setContent] = useState("");

  // 서버와 통신하기 위한 "비동기"함수를 만들어야 한다. 서버와 통신하는 것 자체가 비동기니까!

  // GET 함수
  const fetchTodos = async () => {
    // const { data } = await axios.get("http://localhost:4000/todos");
    const { data } = await api.get(`/todos`);
    // console.log(data);
    setTodos(data);
  };

  useEffect(() => {
    // 최초로 마운트 될 때, db로부터 값을 가져올 것이다.
    fetchTodos();
  }, []);

  // POST 함수
  const onSubmitHandler = async () => {
    api.post(`/todos`, inputValue);
    // setTodos([...todos, inputValue]);
    // id값이 바로 출력되지 않는 오류를 고치려면 setTodos보다는
    // db에는 id가 자동으로 입력되지만 state에는 반영이 안되기때문에
    fetchTodos(); //를 사용해주는 편이 낫다.
  };

  // DELETE 함수
  const onDeleteBtnHandler = async (id) => {
    api.delete(`/todos/${id}`);
    setTodos(
      todos.filter((item) => {
        return item.id !== id;
      })
    );
  };

  // PATCH 함수
  const onUpdateBtnHandler = async () => {
    api.patch(`/todos/${targetId}`, {
      title: content,
    });
    setTodos(
      todos.map((item) =>
        item.id == targetId ? { ...item, title: content } : item
      )
    );
    setTargetId("");
    setContent("");
  };

  return (
    <>
      <div>
        {/* 수정영역(PATCH) */}
        <input
          type="text"
          placeholder="수정할 아이디"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        />
        <input
          type="text"
          placeholder="수정할 내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={onUpdateBtnHandler}>수정</button>
      </div>
      <div>
        {/* input 영역 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();

            //버튼 클릭시, input state에 들어있는 값 을 이용해 DB에 저장
            onSubmitHandler();
          }}
        >
          <input
            type="text"
            value={inputValue.title}
            onChange={(e) => setInputValue({ title: e.target.value })}
          />
          <button>추가</button>
        </form>
      </div>
      <div>
        {/* 옵셔널 체이닝 ? 을 넣어주면 비동기함수에서 값을 받아오기 전인 null 상태일 때 오류가 생기지 않는다. */}
        {todos?.map((item) => {
          return (
            <div key={item.id}>
              {item.id} : {item.title}
              <button
                onClick={(e) => {
                  onDeleteBtnHandler(item.id);
                }}
              >
                삭제
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;

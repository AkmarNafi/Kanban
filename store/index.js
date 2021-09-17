import { v4 as uuidv4 } from "uuid";

export const state = () => ({
  kanbanColumns: [
    { id: "NOT_STARTED", name: "Not Started" },
    { id: "STARTED", name: "Started" },
    { id: "COMPLETED", name: "Completed" }
  ],

  kanbanItems: [
    {
      column: "NOT_STARTED",
      id: 1,
      title: "task1",
      desc: "desc1"
    },

    {
      column: "NOT_STARTED",
      id: 2,
      title: "task 1",
      desc: "desc 1"
    },

    {
      column: "NOT_STARTED",
      id: 3,
      title: "task 1",
      desc: "desc 1"
    }
  ]
});

export const getters = {
  kanbanRenderList: state => {
    let renderList = {};

    for (let i = 0; i < state.kanbanColumns.length; i++) {
      let currentColumn = state.kanbanColumns[i];
      renderList[currentColumn.id] = state.kanbanItems.filter(item => {
        return item.column == currentColumn.id;
      });
    }
    return renderList;
  }
};

export const mutations = {
  moveKanbanItem(state, params) {
    const item = state.kanbanItems.find(item => item.id == params.itemID);
    item.column = params.toColumnID;
  },

  loadFromLocalStorage(state) {
    if (localStorage.getItem("kanbanData")) {
      let kanbanData = JSON.parse(localStorage.getItem("kanbanData"));
      console.log(kanbanData);
      state.kanbanColumns = kanbanData.kanbanColumns;
      state.kanbanItems = kanbanData.kanbanItems;
    }
  },

  saveToLocalStorage(state) {
    localStorage.setItem(
      "kanbanData",
      JSON.stringify({
        kanbanColumns: state.kanbanColumns,
        kanbanItems: state.kanbanItems
      })
    );

    // console.log("saving");
  },

  addKanbanItem(state, data) {
    state.kanbanItems.push({
      id: uuidv4(),
      title: data.title,
      desc: data.desc,
      column: data.column
    });
  },
  updateKanbanItem(state, data) {
    let itemIndex = state.kanbanItems.findIndex(obj => obj.id == data.id);

    state.kanbanItems[itemIndex].title = data.title;
    state.kanbanItems[itemIndex].desc = data.desc;
    state.kanbanItems[itemIndex].column = data.column;
  },
  createNewColumn(state, name) {
    state.kanbanColumns.push({
      id: uuidv4(),
      name: name.trim()
    });
  }
};

export const actions = {
  async moveKanbanItem({ commit }, params) {
    commit("moveKanbanItem", params);
    commit("saveToLocalStorage");
  },
  async loadFromLocalStorage({ commit }, params) {
    commit("loadFromLocalStorage");
  },

  addOrUpdateKanbanItem({ commit }, data) {
    //data validation goes here

    if (!data.column) {
      return;
    }
    if (data.id) {
      commit("updateKanbanItem", data);
    } else {
      commit("addKanbanItem", data);
    }

    commit("saveToLocalStorage");
  },

  createNewColumn({ commit }, name) {
    //data validation goes here

    commit("createNewColumn", name);
    commit("saveToLocalStorage");
  }
};

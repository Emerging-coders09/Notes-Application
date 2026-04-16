import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "../Css/Add&Update.css";
import { useDispatch, useSelector } from "react-redux";
import { updateNote } from "../redux/reducers/notesReducer";

const Update = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [values, setValues] = useState({
    title: "",
    content: "",
  });
  const data = useSelector((state) => state.note.notes);
  const Specificnote = data.find((note) => note.id === Number(id));

  useEffect(() => {
    if(Specificnote){

      setValues({
        title: Specificnote.title,
        content: Specificnote.content,
      });
    }
  }, [Specificnote]);

 useEffect(() => {
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();

    // =========================
    // 🔹 SAVE (Ctrl + Enter)
    // Works inside textarea
    // =========================
    if (e.ctrlKey && key === "enter") {
      e.preventDefault();
      handleSave();
      return;
    }

    // =========================
    // 🔹 ESCAPE (only outside typing)
    // =========================
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (key === "escape") {
      e.preventDefault();
      navigate("/notes");
      return;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [values]); 

  const updatedata = {
    id: id,
    title: values.title,
    content: values.content,
  };

  const handleSave = () => {
    if (values.title === "" || values.content === "") {
      return toast.error("Enter both fields");
    }
    try {
      dispatch(updateNote(updatedata));
      UpdateData();
      navigate("/notes");
      console.log(updatedata);
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateData = async () => {
    try {
      const res = await window.api.editNote(updatedata);
      if (res.success) {
        toast("Data Upated.");
      } else {
        console.log(res.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-addupdate">
      <div className="box-container">
        <div className="header">
          <h1 className="">Update Note</h1>

          <button className="" onClick={() => navigate("/notes")}>
            Cancel
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter note title..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Content
            </label>
            <textarea
              rows="6"
              placeholder="Write your note here..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setValues({ ...values, content: e.target.value })
              }
              value={values.content}
            />
          </div>

          <div className="footer">
            <button className="updatebtn" onClick={handleSave}>
              Update Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;

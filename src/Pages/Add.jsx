import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import "../Css/Add&Update.css";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../redux/reducers/notesReducer";

const Add = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const userId = useSelector((state) => state.auth.user);

  const adduser = {
    user_id: userId.id,
    title: title,
    content: content,
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // =========================
      // 🔹 SAVE (Ctrl + Enter)
      // Works EVEN inside textarea
      // =========================
      if (e.ctrlKey && key === "enter") {
        e.preventDefault();
        handleSave(e);
        return;
      }

      // =========================
      // 🔹 ESC (only outside typing)
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
  }, [title, content]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return toast.error("Enter both fields");
    }

    try {
      const res = await window.api.addNote(adduser);

      if (res?.success) {
        dispatch(addNote(adduser));
        toast.success("Note saved successfully 🎉");
        navigate("/notes");
      } else {
        toast.error(res?.error || "Failed to save");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container">
      <form className="box-container" onSubmit={handleSave}>
        <div className="header">
          <h1 className="">New Note</h1>

          <button onClick={() => navigate("/notes")} className="">
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=""
        />

        <div className="line" />

        <textarea
          placeholder="Write something beautiful..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          className=""
        />

        <div className="footer">
          <span className="">Autosaved locally</span>

          <button type="submit" className="addbtn">
            <Save size={16} />
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;

import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { addTodo, updateTodo, deleteTodo } from '../slices/todoSlice';
import styles from '../styles/modules/modal.module.scss';
import Button from './Button';

const dropIn = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  visible: {
    transform: 'scale(1)',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
};

function TodoModal({ type, modalOpen, setModalOpen, todo }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incomplete');

  useEffect(() => {
    if (type === 'update' && todo) {
      setTitle(todo.title);
      setStatus(todo.status);
    } else {
      setTitle('');
      setStatus('incomplete');
    }
  }, [type, todo, modalOpen]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/todos/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    try {
      if (type === 'add') {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, status }),
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`Failed to add todo (status ${res.status})`);

        const data = JSON.parse(text);
        dispatch(
          addTodo({
            id: data.id,
            title: data.title,
            status: data.stastus || data.status,
            time: data.created_at,
          })
        );
        toast.success('Task added successfully');
      }

      if (type === 'update' && todo) {
        const res = await fetch(`${API_URL}${todo.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, status }),
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`Failed to update todo (status ${res.status})`);

        const data = JSON.parse(text);
        dispatch(
          updateTodo({
            ...todo,
            title: data.title,
            status: data.stastus || data.status,
          })
        );
        toast.success('Task updated successfully');
      }

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    if (!todo) return;

    try {
      const res = await fetch(`${API_URL}${todo.id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete todo (status ${res.status})`);

      dispatch(deleteTodo(todo.id));
      toast.success('Todo deleted successfully');
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <h1 className={styles.formTitle}>
                {type === 'add' ? 'Add' : 'Update'} TODO
              </h1>

              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label htmlFor="status">
                Status
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Completed</option>
                </select>
              </label>

              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === 'add' ? 'Add Task' : 'Update Task'}
                </Button>

                {type === 'update' && (
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Task
                  </Button>
                )}

                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;

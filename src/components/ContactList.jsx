import axios from "axios";
import { useState, useEffect } from "react";

export default function ContactList({ contacts, setContacts }) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const query = `?status=${filter}&search=${search}`;
      const fetchPromise = await axios
        .get(`http://localhost:5000/contacts${query}`)
        .then((res) => setContacts(res.data))
        .catch((err) => console.log(err));
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      await Promise.all([fetchPromise, delay]);
      setLoading(false);
    };
    fetchContacts();
  }, [filter, search, setContacts]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/contacts/${id}`, { status });
      setContacts((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("are you sure you want to delete?")) {
      try {
        await axios.delete(`http://localhost:5000/contacts/${id}`);
        setContacts((prev)=>prev.filter((item)=>item._id!== id));
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="flex gap-10">
        <select
          className="p-2 rounded bg-[#00277a] text-white cursor-pointer outline-0"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Interested">Interested</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or company"
          className="p-3 rounded w-full bg-[#eff4ff] outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="w-full h-[415px] flex flex-col items-center justify-center rounded-[5px] p-[20px] mt-10 gap-4  ">
          <img src="/loading-spinner.svg" alt="" width={80} height={80} />
          <p className="text-[#00277a] text-2xl font-semibold">Loading...</p>
        </div>
      ) : (
        <>
          <div
            className="
        mt-10"
          >
            {contacts.length === 0 && (
              <div className="w-full h-[415px] flex flex-col items-center justify-center rounded-[5px] p-[20px] mt-10 gap-4 bg-[#eff4ff]  ">
                <img src="/no-data.png" alt="" width={200} height={200} />
                <p className="text-[#00277a] text-2xl font-semibold">
                  No contacts found.
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-10">
            {contacts.map((items) => (
              <div key={items._id}>
                <div
                  className="bg-[#eff4ff] shadow-md rounded p-4 flex flex-col justify-between
              hover:shadow-lg transition "
                >
                  <div>
                    <div className="text-gray-500 text-sm flex gap-2 mb-5 mt-0 justify-between items-center">
                      <h3 className="font-bold text-2xl text-[#00277a]  ">
                        {items.name}
                      </h3>
                      <p className="text-[#00277a] p-2 px-4 rounded bg-[#d3e6ff]font-medium">
                        {items.company}{" "}
                      </p>
                    </div>

                    <div className="text-[16px] flex gap-2 my-3 justify-between border -2 border-[#00277a21] px-3 p-3 rounded ">
                      <p>📧 {items.email} </p>
                      <p>📞 {items.phone} </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4  ">
                    <select
                      className="p-1 rounded cursor-pointer outline-0 shadow"
                      value={items.status}
                      onChange={(e) =>
                        handleStatusChange(items._id, e.target.value)
                      }
                    >
                      <option value="Interested">Interested</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                      onClick={() => handleDelete(items._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

import { useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";


const UserSetup = () => {
  
   const [loading, setLoading] = useState(false);
   const [fullName, setFullName] = useState<string>("");
   const [rollNo, setRollNo] =  useState<number | "">("");


   const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
  

    try {
      const response = await api.post("/user", {
        fullName,
        rollNo
      });
      console.log(response.data);
      toast.success("User setup success")
      setFullName("")
      setRollNo("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message)
    } finally {
      setLoading(false);
    }
  };



     return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Student Details
        </h2>

     
        
        

        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="fullname"
            className="block text-gray-700 font-medium mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Enter your full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        {/* Roll Number */}
        <div className="mb-6">
          <label
            htmlFor="rollno"
            className="block text-gray-700 font-medium mb-2"
          >
            Roll No
          </label>
          <input
            type="number"
            id="rollno"
            name="rollno"
            placeholder="Enter your roll number"
            value={rollNo}
            onChange={e => setRollNo(e.target.value === "" ? "": Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );

}

export default UserSetup

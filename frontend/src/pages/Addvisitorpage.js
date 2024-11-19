import React from "react";

const Addvisitorpage = () => {
  // Handle form submission
  const handleSubmit = (checkStatus, event) => {
    if (checkStatus) {
      // If validation passes, do something here
      alert("Form is valid!");
    } else {
      alert("Form validation failed. Please check the fields.");
    }
  };

  return (
    <div>
      {" "}
      <form className="   w-full flex flex-col lg:items-center md:items-center  gap-4">
        {/* Visitor fields */}
        <input
          type="number"
          name="empid"
          className="lg:w-1/3 sm:w-2.5 md:w-1/2 px-3 py-2 border rounded-md"
          placeholder="Employee ID"
          required
        />
        <input
          type="text"
          name="name"
          className="lg:w-1/3 sm:w-full md:w-1/2  px-3 py-2 border rounded-md"
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          className="lg:w-1/3 sm:w-full  md:w-1/2  px-3 py-2 border rounded-md"
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="mobile"
          className="lg:w-1/3 sm:w-full md:w-1/2  px-3 py-2 border rounded-md"
          placeholder="Mobile"
          required
        />
        <input
          type="file"
          name="profile"
          className="lg:w-1/3 sm:w-full md:w-1/2  px-3 py-2 border rounded-md"
        />
      </form>
    </div>
  );
};

export default Addvisitorpage;

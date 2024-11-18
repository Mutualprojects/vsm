import Header from "../components/Header";
import { Button, Form, ButtonToolbar, Schema } from "rsuite";
import { SelectPicker } from "rsuite";

// Sample data for SelectPicker options
const data = [
  "Eugenia",
  "Bryan",
  "Linda",
  "Nancy",
  "Lloyd",
  "Alice",
  "Julia",
  "Albert",
].map((item) => ({ label: item, value: item }));

// Import the required Schema types for validation
const { StringType } = Schema.Types;

// Create a validation model using Schema
const model = Schema.Model({
  name: StringType().isRequired("This field is required."),
  company: StringType().isRequired("Please select a company."),
  department: StringType().isRequired("Please select a department."),
  // email: StringType()
  //   .isEmail("Please enter a valid email address.")
  //   .isRequired("This field is required."),
});

// Custom TextField component to handle form inputs
function TextField(props) {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-3`}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
}

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
    <div style={{ height: "100vh" }} className="pt-28">
      <Header />

      {/* Visitor Form */}
      <div style={{ padding: "20px" }} className="bg-sky-700 text-white">
        <h3>Add a New Visitor</h3>
        <Form
          model={model}
          onSubmit={handleSubmit} // Form submission handler
          fluid // Use fluid form layout for better responsiveness
        >
          <TextField
            name="name"
            label="Full Name"
            outline=""
            className="hover:border-cyan-900"
          />
          <TextField name="Company" label="Company" placeholder="Company" />
          {/* Company Picker */}
          <Form.Group controlId="company">
            <Form.ControlLabel>Company</Form.ControlLabel>
            <Form.Control
              name="company"
              accepter={SelectPicker}
              data={data}
              placeholder="Select a company"
              style={{ width: 224 }}
            />
          </Form.Group>
          {/* Department Picker */}
          <Form.Group controlId="department">
            <Form.ControlLabel>Department</Form.ControlLabel>
            <Form.Control
              name="department"
              accepter={SelectPicker}
              data={data}
              placeholder="Select a department"
              style={{ width: 224 }}
            />
          </Form.Group>

          <ButtonToolbar>
            <Button appearance="primary" type="submit">
              Submit
            </Button>
          </ButtonToolbar>
        </Form>
      </div>
    </div>
  );
};

export default Addvisitorpage;

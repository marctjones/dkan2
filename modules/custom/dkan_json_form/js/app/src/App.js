import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Form from "react-jsonschema-form";
import 'bootstrap-lite/lib.bootstrap.css';
import ToastBox, { toast } from "react-toastbox";
import './App.scss';

const axios = require('axios');

function App() {
  const baseUrl = "";

  let history = useHistory();

  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});
  const [formData, setFormData] = useState({});


  useEffect(() => {
    async function fetchSchema() {
      const response = await axios.get(baseUrl + '/api/1/metastore/schemas/dataset');
      setSchema(response.data);

      const response2 = await axios.get(baseUrl + '/api/1/metastore/schemas/dataset.ui');
      setUiSchema(response2.data);

      const id = getId()
      if (id) {
        setIdentifier(id);
      }
    }
  
    fetchSchema();
  }, []);

  useEffect(() => {
    async function fetch() {
      const response = await axios.get(baseUrl + '/api/1/metastore/schemas/dataset/items/' + identifier);
      setFormData(response.data);
    }  
  
    fetch();
  }, [identifier]);

  useEffect(() => {
    if (message.length > 0) {
      toast.success(message);
    }
  }, [message]);

  function cleanTheData(data) {
    let cleanData = {};
    Object.keys(data).forEach((key) => {
        if (isNaN(key)) {
          cleanData[key] = data[key];
        }
      }
    );
    return cleanData;
  }

  function submitDataset(event) {
    const data = event.formData;
    const cleanData = cleanTheData(data);
    
    if (identifier.length > 0) {
      axios.put(baseUrl + '/api/1/metastore/schemas/dataset/items/' + identifier, cleanData).then(
        () => {
          setMessage("The dataset with identifier " + identifier + " has been updated.");
        }
      ).catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message);
        }
      });;
    }
    else {
      axios.post(baseUrl + '/api/1/metastore/schemas/dataset/items', cleanData).then(
        (response) => {
          const id = response.data.identifier;
          
          let currentUrlParams = new URLSearchParams(window.location.search);
          currentUrlParams.set("id", id);
          history.push(window.location.pathname + "?" + currentUrlParams.toString());
          
          setIdentifier(id);
          setMessage("A dataset with the identifier " + id + " has been created.");
        }
      ).catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message);
        }
      });
    }
  }

  function getId() {
    const urlParams = new URLSearchParams(window.location.search);
    const ids = urlParams.getAll('id');
    if (ids.length > 0) {
      return ids[0];
    }
    return null;
  }

  function CustomFieldTemplate(schema) {
    const {id, classNames, label, help, required, description, errors, children, rawDescription} = schema;
    return (
      <div className={classNames}>
        <label htmlFor={id}>{label}{required ? "*" : null}</label>
        <div dangerouslySetInnerHTML={{__html: rawDescription}} />
        {children}
        {errors}
        {help}
      </div>
    );
  }

  return (
    <>
    <ToastBox
        timerExpires={5000}
        position="top-left"
        pauseOnHover={true}
        intent="success"
      />
    <Form 
        id="dc-json-editor" 
        schema={schema}
        FieldTemplate={CustomFieldTemplate}
        formData={formData} 
        uiSchema={uiSchema}
        autocomplete="on"
        onSubmit={ (e) => {
          setMessage("");
          submitDataset(e);
        } }
        onError={(e) => { console.log(e);}} /></>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import { v4 } from "uuid";

export default function App() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [status, setstatus] = useState();
  const [idtoedit, idsetter] = useState();

  const editnote = (id, city) => {
    setNewAddress(city);
    idsetter(id);
  };

  const deleteitem = async (id) => {
    try {
      const receviedstatus = await axios.delete(`/api/addresses/${id}`);
      const newdata = addresses.filter((value) => value.id !== id);
      setAddresses(newdata);
    } catch (error) {
      console.log(error);
    }
  };

  const saveData = async () => {
    try {
      if (idtoedit) {
        setstatus("saving to server...");
        const updateddata = { city: newAddress };
        const receviedEdit = await axios.put(`/api/addresses/${idtoedit}`, {
          address: updateddata
        });
        const newdata = addresses.map((value) =>
          value.id === idtoedit ? { ...value, city: newAddress } : value
        );
        setAddresses(newdata);
        setstatus("");
        setNewAddress("");
        idsetter("");
      } else {
        setstatus("saving to server...");
        const datatosend = {
          id: v4(),
          city: newAddress
        };
        const receviedstatus = await axios.post("/api/addresses", {
          address: datatosend
        });

        if (receviedstatus.status === 201) {
          setAddresses((currentAddress) => currentAddress.concat(datatosend));
          setstatus("");
          setNewAddress("");
        }
      }
    } catch (error) {
      setstatus("Couldn't save the data");
      console.log(error);
    }
  };
  useEffect(() => {
    (async function () {
      const { data } = await axios.get("/api/addresses");
      setAddresses(data.addresses);
    })();
  }, []);

  return (
    <div className="App">
      <h1> address book </h1>
      <input
        type="text"
        value={newAddress}
        placeholder="enter city"
        onChange={(event) => {
          const { value } = event.target;
          setNewAddress(value);
        }}
      />
      <button onClick={saveData}> Save Address </button>
      <h2>{status}</h2>
      <ul>
        {addresses.map((address) => (
          <div>
            <li key={address.id}>
              {address.city}{" "}
              <button
                onClick={() => {
                  deleteitem(address.id);
                }}
              >
                Delete
              </button>
              <button onClick={() => editnote(address.id, address.city)}>
                Edit
              </button>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

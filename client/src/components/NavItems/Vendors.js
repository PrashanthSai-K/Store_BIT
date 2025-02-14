import React, { useEffect, useState } from "react";
import Cards from "../CommonPages/Cards";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Cookies from "js-cookie";

function Vendors({ open }) {
  //<--------Creating required state variables---------->

  const [manufacturer, setManufacturer] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //<-----End of creation of required state variables------>

  //<------Fetching data from api to render the page------->

  async function fetchManufacturer() {
    const response = await axios
      .get("http://localhost:4000/api/getManufacturer")
      .catch((error) => console.log(error));
    setManufacturer(response.data);
  }
  async function fetchSupplier() {
    const response = await axios
      .get("http://localhost:4000/api/getSupplier")
      .catch((error) => console.log(error));
    setSupplier(response.data);
  }

  useEffect(() => {
    fetchManufacturer();
    fetchSupplier();
  }, []);

  useEffect(() => {
    if (supplier.length > 0 && manufacturer.length > 0) {
      setIsLoading(false);
    }
  }, [supplier, manufacturer]);
  //<------------------- Search functionality for manufacturer table--------------------------->

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (click || searchQuery == "") {
      const filteredResults = manufacturer.filter((item) => {
        const propertiesToSearch = ["name"];
        return propertiesToSearch.some((property) =>
          typeof item[property] === "string"
            ? item[property].toLowerCase().includes(searchQuery.toLowerCase())
            : typeof item[property] === "number"
            ? item[property].toString().includes(searchQuery)
            : false
        );
      });

      setFilteredData(filteredResults);
    }
  }, [click, manufacturer, searchQuery]);

  //<--------------------sort by functionality for manufacturer table-------------------->
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState("");

  const sortData = (column) => {
    let newSortOrder = "asc";
    if (column === sortedColumn) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortOrder(newSortOrder);
    setSortedColumn(column);

    filteredData.sort((a, b) => {
      const valueA =
        typeof a[column] === "string" ? a[column].toLowerCase() : a[column];
      const valueB =
        typeof b[column] === "string" ? b[column].toLowerCase() : b[column];

      if (valueA < valueB) {
        return newSortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return newSortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  //<------------------- Search functionality for supplier table--------------------------->

  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [supplierFilteredData, setSupplierFilteredData] = useState([]);
  const [buttonClick, setButtonClick] = useState(false);

  useEffect(() => {
    if (buttonClick || supplierSearchQuery == "") {
      const SupplierFilteredResults = supplier.filter((item) => {
        const supplierPropertiesToSearch = ["name", "address", "contact"];
        return supplierPropertiesToSearch.some((property) =>
          typeof item[property] === "string"
            ? item[property]
                .toLowerCase()
                .includes(supplierSearchQuery.toLowerCase())
            : typeof item[property] === "number"
            ? item[property].toString().includes(supplierSearchQuery)
            : false
        );
      });

      setSupplierFilteredData(SupplierFilteredResults);
    }
  }, [buttonClick, supplier, supplierSearchQuery]);

  //<--------------------sort by functionality for supplier table-------------------->

  //sort by functionality
  const [supplierSortOrder, setSupplierSortOrder] = useState({
    name: "asc",
    contact: "asc",
    address: "asc",
  });

  const [supplierSortedColumn, setSupplierSortedColumn] = useState("");

  const handleSort = (column) => {
    setSupplierSortOrder((prevSortOrders) => ({
      ...prevSortOrders,
      [column]: prevSortOrders[column] === "asc" ? "desc" : "asc",
    }));

    setSupplierSortedColumn(column);

    supplierFilteredData.sort((a, b) => {
      const valueA =
        typeof a[column] === "string" ? a[column].toLowerCase() : a[column];
      const valueB =
        typeof b[column] === "string" ? b[column].toLowerCase() : b[column];

      if (valueA < valueB) {
        return supplierSortOrder[column] === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return supplierSortOrder[column] === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSupplierFilteredData(supplierFilteredData);
  };

  //<------End of fetching data from api for the page ------->

  //<---------Authentication of user for the page----------->

  const { user, getUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    } else {
      getUser();
    }
  }, [Cookies.get("token")]);

  //<--------End of authentication of user for the page--------->

  const handleKeyEnter = (e) => {
    if (e.key === "Enter") {
      setClick(true);
      setButtonClick(true);
    }
  }

  console.log(supplier)

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-full duration-800 ">
          <span class="loader animate-bounce duration-800"></span>
          Loading
        </div>
      ) : (
        <div className="overflow-x-hidden ">
          <div className={` flex-1 duration-300`}>
            <h1 className="text-2xl font-semibold pt-12 pl-20 animate1">Vendors</h1>
            <div className="flex flex-col justify-center items-center ">
              <Cards />
            </div>
          </div>
          <div
            className={` flex justify-center w-full duration-300 mt-10`}
          >
            <div
              className={`flex ${
                open ? "gap-24" : "gap-36"
              } gap-change  flex-wrap justify-center duration-500`}
            >
              <div className="duration-500 rounded-lg">
                <h1 className="text-center text-xl font-bold animate1">Manufacturer</h1>
                <div className="input-field">
                  <div className="flex justify-center my-5">
                    <div className="h-auto animate1">
                      <input
                        name="inputQuery"
                        type="text"
                        onKeyDown={handleKeyEnter}
                        value={searchQuery}
                        onChange={(e) => {
                          setClick(false);
                          setSearchQuery(e.target.value);
                        }}
                        placeholder="Search..."
                        className="text-black indent-2 font-medium w-80 h-8 rounded-xl border-2 border-black "
                      />
                    </div>
                    <div
                      onClick={() => setClick(true)}
                      className="focus:ring-4 shadow-lg animate1 transform active:scale-75 transition-transform cursor-pointer border-2 border-black rounded-full flex justify-center items-center h-8 pb-1 w-8 ml-2 bg-white"
                    >
                      <i className="text-black bi bi-search"></i>
                    </div>
                  </div>
                </div>
                <div
                  class="vendor-responsive sm:-mx-6  lg:-mx-9 animate2 overflow-y-auto rounded-2xl overflow-x-auto border-gray-700  duration-500"
                  style={{ width:"500px", maxHeight: "350px" }}
                >
                  <div class=" align-middle inline-block min-w-full  ">
                    <div class="shadow overflow-hidden sm:rounded-lg    ">
                      <table class="min-w-full text-sm rounded-lg">
                        <thead style={{backgroundColor:"#0f6af2" , color:"white"}} class="text-xs uppercase font-medium">
                          <tr>
                            <th scope="col" class="px-6 py-3">
                              s.no
                            </th>
                            <th
                              onClick={() => sortData("id")}
                              scope="col"
                              class="px-6 py-3 cursor-pointer whitespace-nowrap"
                            >
                              <div className="flex">
                                <div>Manufacturer ID</div>
                                <span
                                  className={`bi bi-arrow-${
                                    sortOrder === "asc" ? "up" : "down"
                                  } ml-2`}
                                />
                              </div>
                            </th>
                            <th
                              onClick={() => sortData("name")}
                              scope="col"
                              class="px-6 py-3 cursor-pointer"
                            >
                              <div className="flex">
                                <div>Manufacturer Name</div>
                                <span
                                  className={`bi bi-arrow-${
                                    sortOrder === "asc" ? "up" : "down"
                                  } ml-2`}
                                />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{backgroundColor:"white" , fontWeight:"bold"}}>
                          {filteredData.map((data, index) => {
                            return (
                              <tr class="bg-white">
                                <td scope="row" class="px-6 py-4 ">
                                  {index + 1}
                                </td>
                                <td class="px-6 py-4  text-gray-900 whitespace-nowrap">
                                  {data.id}
                                </td>
                                <td class="px-6 py-4  text-gray-900 whitespace-nowrap">
                                  {data.name}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="duration-500">
                <h1 className="text-center text-xl font-bold  animate1">Supplier</h1>
                <div className="input-field">
                  <div className="flex justify-center my-5">
                    <div className="h-auto animate1">
                      <input
                        name="inputQuery"
                        type="text"
                        onKeyDown={handleKeyEnter}
                        value={supplierSearchQuery}
                        onChange={(e) => {
                          setButtonClick(false);
                          setSupplierSearchQuery(e.target.value);
                        }}
                        placeholder="Search..."
                        className="text-black indent-2 font-medium w-80 h-8 rounded-xl border-2 border-black "
                      />
                    </div>
                    <div
                      onClick={() => setButtonClick(true)}
                      className="focus:ring-4 animate1 shadow-lg transform active:scale-75 transition-transform cursor-pointer border-2 border-black rounded-full flex justify-center items-center h-8 w-8 pb-1 ml-2 bg-white"
                    >
                      <i className="text-black bi bi-search"></i>
                    </div>
                  </div>
                  <th scope="col" class=""></th>
                  <th scope="col" class=""></th>
                </div>
                <th scope="col" class=""></th>
                <th scope="col" class=""></th>

                <div
                  class="vendor-responsive animate2 sm:-mx-6 lg:-mx-8 overflow-hidden overflow-y-auto overflow-x-auto border-gray-700 rounded-2xl duration-500"
                  style={{
                    width: "600px",
                    maxHeight: "350px",
                  }}
                >
                  <div class=" align-middle inline-block min-w-full ">
                    <div class="shadow overflow-hidden sm:rounded-lg">
                      <table class="min-w-full text-sm ">
                        <thead style={{backgroundColor:"#0f6af2" , color:"white"}} class="text-xs uppercase font-medium">
                          <tr>
                            <th scope="col" class="px-6 py-3">
                              s.no
                            </th>
                            <th
                              onClick={() => handleSort("id")}
                              scope="col"
                              class="px-6 py-3 cursor-pointer"
                            >
                              <div className="flex">
                                <div>Supplier ID</div>
                                {supplierSortedColumn === "id" && (
                                  <i
                                    className={`bi bi-arrow-${
                                      supplierSortOrder.id === "asc"
                                        ? "up"
                                        : "down"
                                    } ml-2`}
                                  ></i>
                                )}
                              </div>
                            </th>
                            <th
                              onClick={() => handleSort("name")}
                              scope="col"
                              class="px-6 py-3 cursor-pointer"
                            >
                              <div className="flex">
                                <div>Name</div>
                                {supplierSortedColumn === "name" && (
                                  <i
                                    className={`bi bi-arrow-${
                                      supplierSortOrder.name === "asc"
                                        ? "up"
                                        : "down"
                                    } ml-2`}
                                  ></i>
                                )}
                              </div>
                            </th>
                            <th
                              onClick={() => handleSort("address")}
                              scope="col"
                              class="px-6 py-3 cursor-pointer"
                            >
                              <div className="flex">
                                <div>Address</div>
                                {supplierSortedColumn === "address" && (
                                  <i
                                    className={`bi bi-arrow-${
                                      supplierSortOrder.address === "asc"
                                        ? "up"
                                        : "down"
                                    } ml-2`}
                                  ></i>
                                )}
                              </div>
                            </th>
                            <th
                              onClick={() => handleSort("contact")}
                              scope="col"
                              class="px-6 py-3 cursor-pointer"
                            >
                              <div className="flex">
                                <div>Contact</div>
                                {supplierSortedColumn === "contact" && (
                                  <i
                                    className={`bi bi-arrow-${
                                      supplierSortOrder.contact === "asc"
                                        ? "up"
                                        : "down"
                                    } ml-2`}
                                  ></i>
                                )}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{backgroundColor:"white" , fontWeight:"bold"}}>
                          {supplierFilteredData.map((data, index) => {
                            return (
                              <tr class="bg-white">
                                <td class="px-6 py-4">{index + 1}</td>
                                <td class="px-6 py-4">{data.id}</td>
                                <td
                                  scope="row"
                                  class="px-6 py-4 text-gray-900 whitespace-nowrap"
                                >
                                  {data.name}
                                </td>
                                <td class="px-6 py-4">{data.address}</td>
                                <td class="px-6 py-4">{data.contact}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Vendors;

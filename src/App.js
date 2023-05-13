import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCol,
  MDBContainer,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBRow,
  MDBSpinner,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from 'mdb-react-ui-kit';

function App() {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [error, setError] = useState('');

  const [value, setValue] = useState();

  const [sortValue, setSortValue] = useState('');

  const [currentPage, setCurrentPage] = useState(0);

  const [pageLimit] = useState(4);

  const [sortFilterValue, setSortFilterValue] = useState('');

  const [operation, setOperation] = useState('');

  const sortOptions = ['name', 'address', 'email', 'phone', 'status'];

  const loadUserData = async (
    start,
    end,
    increase,
    optType = null,
    filterOrSortValue
  ) => {
    setLoading(true);
    switch (optType) {
      case 'search':
        setOperation(optType);
        setSortValue('');
        setLoading(true);
        return await axios
          .get(
            `http://localhost:5000/users?q=${value}&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      case 'sort':
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        setLoading(true);
        return await axios
          .get(
            `http://localhost:5000/users?_sort=${value}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      case 'filter':
        setOperation(optType);
        setSortFilterValue(filterOrSortValue);
        setLoading(true);
        return await axios
          .get(
            `http://localhost:5000/users?status=${filterOrSortValue}&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      default:
        return axios
          .get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
    }
  };

  useEffect(() => {
    loadUserData(0, 4, 0);
  }, []);

  // console.log('data', data);

  const handleSearch = async (e) => {
    e.preventDefault();
    loadUserData(0, 4, 0, 'search');
    // setLoading(true);
    // return await axios
    //   .get(`http://localhost:5000/users?q=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //     setValue('');
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //     setLoading(false);
    //   });
  };

  const handleReset = () => {
    setOperation('');
    setValue('');
    setSortFilterValue('');
    setSortValue('');
    loadUserData(0, 4, 0);
  };

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    loadUserData(0, 4, 0, 'sort', value);
    // setLoading(true);
    // return await axios
    //   .get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
    //   .then((response) => {
    //     setData(response.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //     setLoading(false);
    //   });
  };

  const handleFilter = async (value) => {
    loadUserData(0, 4, 0, 'filter', value);
    // setLoading(true);
    // return await axios
    //   .get(`http://localhost:5000/users?status=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //     setLoading(false);
    //   });
  };

  const renderPagination = () => {
    if (data.length < 4 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() => loadUserData(4, 8, 1, operation, sortFilterValue)}
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>

          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage + 1) * 4,
                  (currentPage + 2) * 4,
                  1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  if (error) {
    return (
      <div
        style={{
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <MDBContainer>
      <form
        style={{
          margin: 'auto',
          padding: '15px',
          maxWidth: '400px',
          alignContent: 'center',
        }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search Name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <MDBBtn type="submit" color="dark">
          Search
        </MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={handleReset}>
          Reset
        </MDBBtn>
      </form>
      <div style={{ marginTop: '100px' }}>
        <h2 className="text-center">
          Search, Filter, Sort and Paginate Using JSON Fake REST API
        </h2>

        {loading ? (
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: '20vh', marginBottom: '30vh' }}
          >
            <MDBSpinner
              className="me-2"
              style={{ width: '6rem', height: '6rem' }}
            />
          </div>
        ) : (
          <>
            <MDBRow>
              <MDBCol size="12">
                <MDBTable>
                  <MDBTableHead dark>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone No.</th>
                      <th scope="col">Address</th>
                      <th scope="col">Status</th>
                    </tr>
                  </MDBTableHead>
                  {data.length === 0 ? (
                    <MDBTableBody className="align-center mb-0">
                      <tr>
                        <td colSpan={8} className="text-center mb-0">
                          No Data Found
                        </td>
                      </tr>
                    </MDBTableBody>
                  ) : (
                    data.map((item, index) => {
                      return (
                        <MDBTableBody key={index}>
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.address}</td>
                            <td>{item.status}</td>
                          </tr>
                        </MDBTableBody>
                      );
                    })
                  )}
                </MDBTable>
              </MDBCol>
            </MDBRow>
            <div
              style={{
                margin: 'auto',
                padding: '15px',
                maxWidth: '250px',
                alignContent: 'center',
              }}
            >
              {renderPagination()}
            </div>
          </>
        )}
      </div>

      {data.length > 0 && (
        <MDBRow>
          <MDBCol size="8">
            <h5>Sort By:</h5>{' '}
            <select
              style={{ width: '50%', borderRadius: '2px', height: '35px' }}
              value={sortValue}
              onChange={handleSort}
            >
              <option>Please Select Value</option>
              {sortOptions.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </MDBCol>

          <MDBCol size="4">
            <h5>Filter By Status:</h5>
            <MDBBtnGroup>
              <MDBBtn color="success" onClick={() => handleFilter('Active')}>
                Active
              </MDBBtn>
              <MDBBtn
                color="danger"
                style={{ marginLeft: '2px' }}
                onClick={() => handleFilter('Inactive')}
              >
                Inactive
              </MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default App;

const {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  NavItem,
  Row,
  Table,
  Modal,
  Breadcrumb,
  ListGroup,
  Spinner,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Tooltip,
  Tabs,
  Tab,
} = ReactBootstrap

const FHIRENDPOINT = "/fhir/r4/"

class DashboardView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: false,
      result: null,
    }
    this.import = this.import.bind(this)
  }

  import(e) {
    this.setState({ progress: true })
    fetch('api/import')
      .then(res => res.text())
      .then(result => this.setState({ result, progress: false }))
  }

  render() {
    return (
      <Container fluid>
        <Button disabled={this.state.progress} onClick={(e) => this.import()}>
          Import
          {this.state.progress && (
            <>
              &nbsp;
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </>
          )}
        </Button>
        {this.state.result && (
          <pre>
            {this.state.result}
          </pre>
        )}
      </Container>
    )
  }
}

class ResourceListView extends React.Component {

  constructor(props) {
    super(props)
    const data = []
    const search = ''
    this.state = {
      data,
      search,
    }
    this.loadData()
    this.loadData = this.loadData.bind(this)
  }

  loadData(reset) {
    const { resource } = this.props
    let url = `${FHIRENDPOINT}${resource}?`
    let append = false
    if (!reset && this.state.nextLink && this.state.nextLink.includes(url)) {
      url = this.state.nextLink
      append = true
    }
    let params = [
      `_count=30`,
      `name=${this.state.search}`,
    ].join('&')
    fetch(`${url}&${params}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(({ entry, link }) => {
        const nextLink = (link.find(l => l.relation === 'next') || { url: '' }).url
        const data = append ? [...this.state.data, ...entry] : entry
        this.setState({ data, nextLink })
      })
  }

  componentDidUpdate(props, state) {
    if (state.search !== this.state.search) {
      this.loadData()
    }
  }

  getValue(entry, path) {
    if (entry['system'] && entry['value']) {
      return entry['system'] === path ? entry['value'] : ''
    }
    if (path.includes('.')) {
      const pathList = path.split('.')
      const name = pathList.shift()
      const value = entry[name] || {}
      return Array.isArray(value)
        ? value.map(v => this.getValue(v, pathList.join('.'))).join(' ')
        : this.getValue(value, pathList.join('.'))
    }
    const value = entry[path] || ''
    const values = Array.isArray(value) ? value : [value]
    return this[path]
      ? values.map(v => this[path](v)).join(' ')
      : values.map(v => this.processValue(v)).join(' ')
  }

  processValue(value) {
    if (typeof value === 'object') {
      if (value.text) {
        return value.text
      }
      return ''
    }
    return value
  }

  address(value) {
    const { line, city, state, postalCode, country } = {
      line: [],
      state: '',
      city: '',
      postalCode: '',
      country: '',
      ...value
    }
    return `${line.join(', ')}, ${city}, ${state}, ${postalCode}, ${country}`
  }

  render() {
    return (
      <>
        <Navbar bg="light" expand="lg" sticky="top">
          <Container fluid>
            <InputGroup>
              <Form.Control value={this.state.search} placeholder="Search" onChange={(e) => this.setState({ search: e.target.value })}></Form.Control>
              {/* <Button>Search</Button> */}
            </InputGroup>
          </Container>
        </Navbar>
        <InfiniteScroll
          dataLength={this.state.data.length}
          hasMore={!!this.state.nextLink}
          next={this.loadData}
          loader={<h4>Loading...</h4>}
        >
          <Table>
            <thead>
              <tr>
                {this.props.columns && this.props.columns.map(c => <th>{c.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {this.state.data && this.state.data.map(entry => (
                <tr>
                  {this.props.columns.map(c => (
                    <td>
                      {this.getValue(entry.resource, c.value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </InfiniteScroll>
      </>
    )
  }
}

class PatientListView extends React.Component {

  render() {
    const columns = [
      { name: '#', value: 'id' },
      { name: 'First Name', value: 'name.given' },
      { name: 'Last Name', value: 'name.family' },
      { name: 'DOB', value: 'birthDate' },
    ]
    return (
      <ResourceListView resource="Patient" columns={columns} />
    )
  }
}

class PractitionerListView extends React.Component {
  render() {
    const columns = [
      { name: '#', value: 'id' },
      { name: 'First Name', value: 'name.given' },
      { name: 'Last Name', value: 'name.family' },
    ]
    return (
      <ResourceListView resource="Practitioner" columns={columns} />
    )
  }
}

class OrganizationListView extends React.Component {
  render() {
    const columns = [
      { name: 'Name', value: 'name' },
      { name: 'Type', value: 'type' },
      { name: 'Address', value: 'address' },
      { name: 'Phone', value: 'telecom.phone' },
    ]
    return (
      <ResourceListView resource="Organization" columns={columns} />
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidUpdate(props, state) {
    if (props.filter !== this.props.filter) {
      this.updateFilter()
    }
    if (state.system !== this.state.system) {
      this.getGlobals()
      localStorage.setItem('system', this.state.system)
    }
  }

  readParams() {
    const state = new Map()
    searchParams.forEach((value, name) => {
      state.set(name, value)
    })
    return Object.fromEntries(state.entries())
  }

  componentDidUpdate(props, state) {

  }

  render() {
    return (
      <Tab.Container id="main-tabs" defaultActiveKey="dashboard" activeKey={this.state.key}>
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
          <Container fluid>
            <Navbar.Brand>FHIR</Navbar.Brand>
            <Nav className="me-auto" onSelect={(key) => this.setState({ key })}>
              <Nav.Link eventKey="dashboard" href="#">Dashboard</Nav.Link>
              <Nav.Link eventKey="patientlist" href="#">Patient</Nav.Link>
              <Nav.Link eventKey="practitionerlist" href="#">Practitioners</Nav.Link>
              <Nav.Link eventKey="organizationlist" href="#">Organization</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container fluid className="main-content">
          <Tab.Content>
            <Tab.Pane eventKey="dashboard">
              <DashboardView />
            </Tab.Pane>
          </Tab.Content>
          {{
            'patientlist': <PatientListView />,
            'practitionerlist': <PractitionerListView />,
            'organizationlist': <OrganizationListView />,
          }[this.state.key] || (
              <></>
            )}
        </Container>
      </Tab.Container>
    )
  }
}

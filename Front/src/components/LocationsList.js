import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter, Switch } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import SimpleModal from "./PopupDialog";
import PrivateRoute from "./PrivateRoute";

import { getLocations } from "../actions/locations/getLocations";
import { deleteLocation } from "../actions/locations/deleteLocation";
import LocationForm from "./LocationForm";

const styles = {
  table: {
    minWidth: "auto"
  },
  hoverHand: {
    cursor: "pointer"
  }
};

const LocationItem = ({
  id,
  city,
  address,
  deleteHandler,
  editLocationHandler
}) => (
  <TableRow
    style={{ cursor: "pointer" }}
    onClick={() => editLocationHandler(id)}
  >
    <TableCell component="th" scope="row">
      {city}
    </TableCell>
    <TableCell>{address}</TableCell>
    <TableCell>
      <DeleteForeverIcon
        onClick={e => {
          e.stopPropagation();
          deleteHandler(id);
        }}
      />
    </TableCell>
  </TableRow>
);

class LocationsList extends Component {
  constructor(props) {
    super(props);
    this.deleteLocationHandler = this.deleteLocationHandler.bind(this);
    this.editLocationHandler = this.editLocationHandler.bind(this);
  }

  componentDidMount = () => {
    this.props.getLocations();
  };

  deleteLocationHandler = locationId => {
    this.props.deleteLocation(locationId);
  };

  editLocationHandler = locationId => {
    const currentPath = this.props.location.pathname.replace("/", "");
    this.props.history.push(`${currentPath}/${locationId}`);
  };

  renderLocations = locations => {
    let rows = [];
    for (let key in locations) {
      let location = locations[key];
      rows.push(
        <LocationItem
          key={location._id}
          id={location._id}
          city={location.city}
          address={location.address}
          deleteHandler={this.deleteLocationHandler}
          editLocationHandler={this.editLocationHandler}
        />
      );
    }
    return rows;
  };

  render() {
    const { classes, locations } = this.props;
    return locations ? (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>Address</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>{this.renderLocations(locations, classes)}</TableBody>
        <Switch>
          <PrivateRoute
            exact
            path="/locations/new"
            title="Create a new location"
            authenticated={true}
            component={SimpleModal}
            childComponent={LocationForm}
          />
          <PrivateRoute
            path="/locations/:id"
            title="Edit location"
            authenticated={true}
            component={SimpleModal}
            childComponent={LocationForm}
          />
        </Switch>
      </Table>
    ) : (
      <div>Loading...</div>
    );
  }
}

LocationsList.propTypes = {
  classes: PropTypes.object.isRequired,
  locations: PropTypes.object
};

const mapStateToProps = state => {
  return {
    locations: state.locations.all
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getLocations, deleteLocation }, dispatch);
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(LocationsList))
);

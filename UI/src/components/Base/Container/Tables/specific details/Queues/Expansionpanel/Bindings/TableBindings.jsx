/*
* Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FormLabel from '@material-ui/core/FormLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';

const rows = [
	{
		id: 'Exchange',
		numeric: false,
		disablePadding: true,
		label: 'Exchange'
	},

	{
		id: 'RoutingKey',
		numeric: true,
		disablePadding: false,
		label: 'Routing Key'
	}
];

class EnhancedTableHead extends React.Component {
	state = {
		Bindings: []
	};

	render() {
		return (
			<TableHead>
				<TableRow>
					<TableCell padding="checkbox" />
					{rows.map((row) => {
						return (
							<TableCell
								key={row.id}
								numeric={row.numeric}
								padding={row.disablePadding ? 'none' : 'default'}
							>
								<FormLabel>{row.label}</FormLabel>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

EnhancedTableHead.propTypes = {
	onSelectAllClick: PropTypes.func.isRequired,
	rowCount: PropTypes.number.isRequired
};

const toolbarStyles = (theme) => ({
	root: {
		paddingRight: theme.spacing.unit
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
				}
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
				},
	spacer: {
		flex: '1 1 100%'
	},
	actions: {
		color: theme.palette.text.secondary
	},
	title: {
		flex: '0 0 auto'
	}
});

let EnhancedTableToolbar = (props) => {
	const { classes } = props;

	return (
		<Toolbar>
			<div className={classes.title}>
				<Typography variant="h6" id="tableTitle">
					Binding details
				</Typography>
			</div>
			<div className={classes.spacer} />
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = (theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3
	},
	table: {
		minWidth: 1020
	},
	tableWrapper: {
		overflowX: 'auto'
	},
	tableRow: {
		'&:hover': {
			backgroundColor: '#B2DFDB !important'
		}
	},
	container: {
		display: 'flex',
		length: 10
	},
	button: {
		margin: theme.spacing.unit,
		width: 10,
		lineHeight: '100px'
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: '61px'
	}
});

const newTo = {
	pathname: 'exchangeClicked',
	param1: 'Par1'
};

/**
 * Construct the table for adding new bindings to queues
 * @class  Tablebindings
 * @extends {React.Component}
 */

class Tablebindings extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		bindingPattern: '',

		data: [],

		page: 0,
		rowsPerPage: 5
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};

	handleOnChange = (event) => {
		const userInput = event.target.value;
		this.setState({
			bindingPattern: userInput
		});
	};

	handleOnSave = (event) => {
		const url = `/broker/v1.0/queues/${this.props.data.trim()}/bindings`;

		axios
			.get(url, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer YWRtaW46YWRtaW4='
				}
			})
			.then((response) => {
				const DATA = [];
				response.data.forEach((element, index) => {
					DATA.push({
						id: index,
						bindingPattern: element.bindingPattern,
						bindings: element.bindings['queueName']
					});
				});

				this.setState({ data: DATA });
			})
			.catch(function(error) {});
	};

	render() {
		const { classes } = this.props;
		const { data, rowsPerPage, page } = this.state;

		return (
			<div>
				<div className={classes.container}>
					<TextField
						id="outlined-with-placeholder"
						label="Binding Pattern"
						placeholder="Enter Binding pattern"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						onChange={this.handleOnChange}
					/>{' '}
				</div>
				<Paper className={classes.root}>
					<EnhancedTableToolbar />
					<div className={classes.tableWrapper}>
						<Table className={classes.table} aria-labelledby="tableTitle">
							<EnhancedTableHead onSelectAllClick={this.handleSelectAllClick} rowCount={data.length} />
							<TableBody>
								{data
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((element, index) => {
										return (
											<TableRow
												hover
												className={classes.tableRow}
												key={index}
												role="checkbox"
												tabIndex={-1}
											>
												<TableCell padding="checkbox" />

												<TableCell component="th" scope="row" padding="10px">
													{element.bindingPattern}
												</TableCell>
												<TableCell numeric>{element.bindingPattern}</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</div>
					<TablePagination
						component="div"
						count={data.length}
						rowsPerPage={rowsPerPage}
						page={page}
						backIconButtonProps={{
							'aria-label': 'Previous Page'
						}}
						nextIconButtonProps={{
							'aria-label': 'Next Page'
						}}
						onChangePage={this.handleChangePage}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				</Paper>
			</div>
		);
	}
}

Tablebindings.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Tablebindings);

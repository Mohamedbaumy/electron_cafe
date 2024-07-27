
import React from "react";
import { Col, Row } from "reactstrap";

const Excel = ({ onClick }) => {
	return (
		<Row className="justify-content-center mb-12">
			<Col md={12}>
				<button
					className="w-full rounded-full bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-700"
					onClick={() => {
						onClick();
					}}
					type="button"
				>
					{t("keywords.download_report")}
				</button>
			</Col>
		</Row>
	);
};

export default Excel;

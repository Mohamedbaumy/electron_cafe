import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const exportToExcel = async (data, name) => {
	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = "xlsx";
	const filteredData = data.map(
		({
			hash,
			lab_id,
			user_id,
			id,
			isdeleted,
			insert_record_date,
			patient_hash,
			ispayed,
			visit_type,
			...rest
		}) => rest,
	);
	const ws = XLSX.utils.json_to_sheet(filteredData);
	const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
	const excelBuffer = XLSX.write(wb, {
		bookType: fileExtension,
		type: "array",
	});
	const fileData = new Blob([excelBuffer], { type: fileType });
	FileSaver.saveAs(fileData, name + "." + fileExtension);
};

export default exportToExcel;

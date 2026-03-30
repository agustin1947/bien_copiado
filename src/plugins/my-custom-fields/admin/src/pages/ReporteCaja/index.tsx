import { FiltersByYearAndMonth } from "../../components/FiltersByYearAndMonth";

const ReporteCaja = () => {
    return (
        <div className="container">
            <div className="title_h1">
                Reporte Mensual
            </div>
            <FiltersByYearAndMonth />
        </div>
    )
}

export default ReporteCaja;
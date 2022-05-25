import { Fragment } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import { RootState } from '../../store';

type Props = {
    redirect: boolean,
    redirectUrl?: string,
    string: string,
    classes?: string
}
const Button = ({ redirect, redirectUrl, string, classes }: Props) => {
    return (
        <Fragment>
            {!redirect ?
            <button className={'standard-btn ' + classes}>{string}</button> :
            <button className={'standard-btn ' + classes}><Link to={redirectUrl ? redirectUrl : ''}>{string}</Link></button>
            }
        </Fragment>
    )
}

const mapStateToProps = (state: RootState) => ({
    reducer: state.reducer
})
export default connect(mapStateToProps)(Button)
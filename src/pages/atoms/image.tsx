import { Fragment } from "react";
import { connect } from "react-redux"
import { RootState } from '../../store';

type Props = {
    url: string,
    background: boolean,
    classes?: string,
    alt?: string
}
const Image = ({ url, background, classes, alt }: Props) => {
    if (background) {
        return (
            <Fragment>
                <div
                style={{backgroundImage: `url(${url})`}}
                className={classes}
                ></div>
            </Fragment>
        )
    } else {
        return (
            <Fragment>
                <img alt={(alt) ? alt : "image"} className={classes} src={url} />
            </Fragment>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    reducer: state.reducer
})
export default connect(mapStateToProps)(Image)
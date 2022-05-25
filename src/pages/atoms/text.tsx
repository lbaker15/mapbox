import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux"
import { RootState } from '../../store';

type Props = {
    elementTag: string,
    content: string,
    classes?: string
}
const Text = ({ elementTag, content, classes }: Props) => {
    const [el, setEl] = useState<React.ReactNode | null>(null);
    useEffect(() => {
        let el: React.ReactNode = React.createElement(elementTag, {className: classes}, content);
        setEl(el)
    }, [content])
    return (
        <Fragment>
            {el}
        </Fragment>
    )
}

const mapStateToProps = (state: RootState) => ({
    reducer: state.reducer
})
export default connect(mapStateToProps)(Text)
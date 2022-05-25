import { connect } from "react-redux"
import { RootState } from '../../store';

type Props = {
    item: { url: string, text: string }
}
const Link = ({ item }: Props) => {
    return (
        <a href={item.url}>{item.text}</a>
    )
}

const mapStateToProps = (state: RootState) => ({
    reducer: state.reducer
})
export default connect(mapStateToProps)(Link)
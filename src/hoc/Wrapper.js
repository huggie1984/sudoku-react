//this is a prime exampe of using a higher order component, we are simply rendering the children nested inside,
// this is an alternative method then rendering an unessasary div .
const wrapper = (props) => props.children;

export default wrapper;
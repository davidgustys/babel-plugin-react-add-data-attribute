function Sibling() {
  return <div />
}

function Siblings() {
  return (
    <div>
      hello
      <Sibling/>
      <Sibling/>
    </div>
  )
}

function Sibling() {
  return <div />
}

function Siblings() {
  return (
    <div>
      hello
      <Sibling data-test="i-exist"/>
      <Sibling/>
    </div>
  )
}

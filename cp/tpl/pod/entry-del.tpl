<style type="text/css">
#incp-podentry-del {
  font-size: 1.2em;
  line-height: 160%;
}
#incp-podentry-del ul {
  margin: 0;
  padding: 0 10px;
}
#incp-podentry-del li {
  margin: 5px 10px;
  padding: 0;
}
</style>
<div id="incp-podentry-del">  
    <input type="hidden" name="meta_id" value="{[=it.meta.id]}">
    <div id="incp-podentry-del-alert" class="alert alert-danger">
      <p>All the data {[if (it.apps && it.apps.length > 0) {]}and the following applications {[}]}will lost, are you sure to destroy this pod?</p>
      {[if (it.apps && it.apps.length > 0) {]}
      <ul>
        {[~it.apps :app]}
        <li>{[=app.meta.name]}</li>
        {[~]}
      </ul>
      {[}]}
    </div>
</div>

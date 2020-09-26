<div id="incp-appspec-cfg-fieldlist-alert"></div>

<div id="incp-appspec-cfg-fieldlist"></div>
<style>
#incp-appspec-cfg-fieldlist .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 120%;
}
#incp-appspec-cfg-fieldlist button.icon-x20 {
  padding: 0px;
  width: 22px;
  height: 22px;
  font-size: 11px;
  text-align: center;
}
#incp-appspec-cfg-fieldlist th {
  font-weight: normal;
}
#incp-appspec-cfg-fieldlist .card-body {
  padding: 0 10px;
}
</style>

<script type="text/html" id="incp-appspec-cfg-fieldlist-tpl">

<table class="incp-formtable">
<tbody>

<tr>
  <td width="150px">Name</td>
  <td width="30px"></td>
  <td>
    <input id="incp-appspec-cfg-fieldlist-name" name="name" class="form-control" value="{[=it.configurator.name]}">
  </td>
</tr>


<tr>
  <td>Fields</td>
  <td>
    <button class="btn btn-primary icon-x20" onclick="inCpAppSpec.CfgFieldSet()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
  {[? !it.configurator.fields || it.configurator.fields.length == 0]}
    <div class="badge badge-secondary">no Feild Setup yet ...</div>
  {[??]}
    <table class="table-hover">
    <thead>
    <tr>
      <th>Name</th>
      <th>Title</th>
      <th>Type</th>
      <th>Default</th>
      <th>Auto fill</th>
      <th>Validates</th>
      <th></th>
    </tr>
    </thead>
    <tbody id="incp-appspec-cfg-fields">
    {[~it.configurator.fields :v]}
    <tr>
      <td class="incp-font-fixspace">{[=v.name]}</td>
      <td>{[=v.title]}</td>
      <td>
      {[~it._cfgFieldTypes :vt]}
        {[if (v.type == vt.type) {]}{[=vt.title]}{[}]}
      {[~]}
      </td>
      <td>{[=inCpAppSpec.CfgFieldSubString(v.default, 30)]}</td>
      <td>{[=v.auto_fill]}</td>
      <td>{[=v.validates.length]}</td>
      <td align="right">
        {[if (it.meta.user == inCp.UserSession.username) {]}
        <button class="btn btn-dark" onclick="inCpAppSpec.CfgFieldSet('{[=v.name]}')">Setting</button>
        {[}]}
      </td>
    </tr>
    {[~]}
    </tbody>
    </table>
  {[?]}
  </td>
</tr>

</tbody>
</table>

</script>


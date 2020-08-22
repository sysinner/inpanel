<div id="incp-appspec-cfg-fieldlist-alert"></div>

<div id="incp-appspec-cfg-fieldlist"></div>

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
  <td></td>
  <td>
    <table class="">
    <thead>
    <tr>
      <th>Name</th>
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
      <td>
      {[~it._cfgFieldTypes :vt]}
        {[if (v.type == vt.type) {]}{[=vt.title]}{[}]}
      {[~]}
      </td>
      <td>{[=v.default]}</td>
      <td>{[=v.auto_fill]}</td>
      <td>{[=v.validates.length]}</td>
      <td align="right">
        {[if (it.meta.user == inCp.UserSession.username) {]}
        <button class="incp-btn incp-btn-xsmall" onclick="inCpAppSpec.CfgFieldSet('{[=v.name]}')">Setting</button>
        {[}]}
      </td>
    </tr>
    {[~]}
    </tbody>
    </table>
  </td>
</tr>

</tbody>
</table>

</script>


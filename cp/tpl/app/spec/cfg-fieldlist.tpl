<div id="incp-appspec-cfg-fieldlist-alert"></div>

<div id="incp-appspec-cfg-fieldlist"></div>

<script type="text/html" id="incp-appspec-cfg-fieldlist-tpl">
<div class="l4i-form-group">
  <label>Name</label>
  <p><input name="name" class="form-control" value="{[=it.configurator.name]}"></p>
</div>

<div class="l4i-form-group">
  <label>Fields</label>
  <div>
    <table class="table table-hover">
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
  </div>
</div>
</script>



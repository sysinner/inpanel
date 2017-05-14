<div id="loscp-appspec-cfg-fieldlist-alert"></div>

<div id="loscp-appspec-cfg-fieldlist"></div>

<script type="text/html" id="loscp-appspec-cfg-fieldlist-tpl">
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
      <th>Validates</th>
      <th></th>
    </tr>
    </thead>
    <tbody id="loscp-appspec-cfg-fields">
    {[~it.configurator.fields :v]}
    <tr>
      <td class="loscp-font-fixspace">{[=v.name]}</td>
      <td>
      {[~it._cfgFieldTypes :vt]}
        {[if (v.type == vt.type) {]}{[=vt.title]}{[}]}
      {[~]}
      </td>
      <td>{[=v.default]}</td>
      <td>{[=v.validates.length]}</td>
      <td align="right">
        <button class="loscp-btn loscp-btn-xsmall" onclick="losCpAppSpec.CfgFieldSet('{[=v.name]}')">Setting</button>
      </td>
    </tr>
    {[~]}
    </tbody>
    </table>
  </div>
</div>
</script>



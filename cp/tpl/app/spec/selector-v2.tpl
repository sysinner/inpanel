
<div id="incp-app-specls-selector-alert" class="alert alert-warning" style="display:none">No more results ...</div>

<table width="100%">
  <tr>
    <td>
      <form onsubmit="inCpAppSpec.ListSelectorQueryCommit(); return false;" id="incp-app-specls-selector-qry" action="#" class="form-inlines">
        <input id="incp-app-specls-selector-qry-text" type="text"
          class="form-control incp-app-list-qry-input" 
          placeholder="Press Enter to Search" 
          value="">
      </form>
    </td>
  </tr>
</table>

<div id="incp-app-specls-selector"></div>

<script id="incp-app-specls-selector-tpl" type="text/html">
<input type="hidden" id="incp-app-specls-selector-option-cfg-selector" value="{[=it.options.cfg_selector]}">
<table class="table table-hover valign-middle">
<thead>
  <tr>
    <th>ID</th>
    <th>User</th>
    <th>Updated</th>
    {[? it.options.cfg_selector]}
    <th>Sharing Configuration</th>
    {[?]}
    <th></th>
  </tr>
</thead>
<tbody>
{[~it.items :v]}
<tr>
  <td>{[=v.meta.id]}</td>
  <td>{[=v.meta.user]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  {[? it.options.cfg_selector]}
  <td>
  {[? v.configurator]}
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="appspec-cfg-main" value="{[=v.configurator.name]}">
      <label class="form-check-label">
        {[=v.configurator.name]}
      </label>
    </div>
  {[?]}
  </td>
  {[?]}
  <td align="right">
    <button class="btn btn-default btn-sm" onclick="inCpAppSpec.ListSelectorClick('{[=v.meta.id]}')">Select</button>
  </td>
</tr>
{[~]}
</tbody>
</table>
</script>

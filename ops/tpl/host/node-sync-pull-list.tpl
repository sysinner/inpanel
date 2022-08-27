<div id="inops-host-node-sync-pull-list-alert"></div>

<div class="">
  <table class="table table-hover valign-middle">
  <thead>
  <tr>
    <th colspan="2" >Instance</th>
    <th colspan="2" >Cloud </th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>ID</th>
    <th>Name</th>
    <th>Bind</th>
    <th></th>
  </tr>
  </thead>
  <tbody id="inops-host-node-sync-pull-list"></tbody>
  </table>
</div>

<script id="inops-host-node-sync-pull-list-tpl" type="text/html">
{[~it.items :v]}
<tr class="inops-host-node-sync-pull-item">
  <td class="incp-font-fixspace">
    {[? v.instance_id]}{[=v.instance_id]}{[??]}--{[?]}
  </td>
  <td class="incp-font-fixspace">
    {[? v.instance_name]}{[=v.instance_name]}{[??]}--{[?]}
  </td>
  <td class="incp-font-fixspace">
    {[=v.cloud_provider.instance_id]}
  </td>
  <td class="incp-font-fixspace">
    {[=v.cloud_provider.instance_name]}
  </td>
  <td>
    <div class="form-check">
      <input style="display:none" type="text" name="cloud_instance_id" value="{[=v.cloud_provider.instance_id]}"/> 
      <input class="form-check-input" type="checkbox" name="action" value="{[=v.action]}" 
        id="id-{[=v.cloud_provider.instance_id]}" {[? v.action == inOpsHost.ResHostCloudProviderSyncBound]}checked disabled{[?]}>
      <label class="form-check-label" for="flexCheckChecked">
        {[=inOpsHost.CloudProviderSyncActionName(v.action)]}
      </label>
    </div>
  </td>
  <td>
    <span id="id-{[=v.cloud_provider.instance_id]}-alert"></span>
  </td>
</tr>
{[~]}
</script>


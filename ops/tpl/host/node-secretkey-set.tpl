<div id="inops-host-node-secretkey-form">
 
  <div id="inops-host-node-secretkey-set-alert"></div>

  <input type="hidden" name="node_id" value="{[=it.node_id]}">
  <input type="hidden" name="zone_id" value="{[=it.zone_id]}">

  <div class="valueui-form-group">
    <label>Secret Key</label>
    <input type="text" name="secret_key" class="form-control" placeholder="Enter the Host Secret Key" value="">
	<p style="padding: 5px 0">get the host's secret key in etc/config.json host/secret_key</p>
  </div>
</div>

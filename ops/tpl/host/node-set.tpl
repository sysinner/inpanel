<div id="inops-host-node-form">
 
  <div id="inops-host-nodeset-alert"></div>

  <input type="hidden" name="id" value="{[=it.meta.id]}">
  <input type="hidden" name="operate_zone_id" value="{[=it.operate.zone_id]}">
  <input type="hidden" name="operate_cell_id" value="{[=it.operate.cell_id]}">

  <div class="l4i-form-group">
    <label>Host</label>
    <div>{[=it.spec.peer_lan_addr]}</div>
  </div>

  <div class="l4i-form-group">
    <label>Name</label>
    <input type="text" name="name" class="form-control" placeholder="Enter the Host Name" value="{[=it.meta.name]}">
  </div>

  <div class="l4i-form-group">
    <label>Action</label>
    <div class="">
      {[~it._actions :v]}
      <span class="ids-form-checkbox">
        <input type="radio" name="operate_action" value="{[=v.action]}" {[ if (v.action == it.operate.action) { ]}checked="checked"{[ } ]}> {[=v.title]}
      </span>
      {[~]}
    </div>
  </div>

</div>

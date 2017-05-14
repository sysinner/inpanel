<div id="losops-host-node-form">
 
  <div id="losops-host-nodenew-alert"></div>

  <input type="hidden" name="operate_zone_id" value="{[=it.operate.zone_id]}">
  <input type="hidden" name="operate_cell_id" value="{[=it.operate.cell_id]}">

  <div class="l4i-form-group">
    <label>IP Address</label>
    <div><input type="text" name="peer_lan_addr" class="form-control" placeholder="Enter the Address" value=""></div>
  </div>

  <div class="l4i-form-group">
    <label>Name</label>
    <input type="text" name="name" class="form-control" placeholder="Enter the Host Name" value="">
  </div>

  <div class="l4i-form-group">
    <label>Action</label>
    <div class="">
      {[~it._actions :v]}
      <span class="ids-form-checkbox">
        <input type="radio" name="operate_action" value="{[=v.action]}" {[ if (v.action == it.operate_action) { ]}checked="checked"{[ } ]}> {[=v.title]}
      </span>
      {[~]}
    </div>
  </div>

</div>

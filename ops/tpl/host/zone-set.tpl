<style>
#inops-host-zone-form .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 100%;
}
#inops-host-zone-form table th {
  padding: 4px 0;
}
#inops-host-zone-form table td {
  padding: 4px 0;
}
</style>

<div id="inops-host-zone-form">

  <div id="inops-host-zoneset-alert"></div>

  {[ if (it.meta.id) { ]}
    <input type="hidden" name="id" value="{[=it.meta.id]}">
  {[ } else { ]}
  <div class="l4i-form-group">
    <label class="">Zone</label>
    <div>
      <input type="text" name="id" class="form-control" placeholder="Enter the Zone ID" value="{[=it.meta.id]}"
        {[ if (it.meta.id) { ]}readonly{[ } ]}>
    </div>
  </div>
  {[ } ]}

  <div class="l4i-form-group">
    <label class="">Summary</label>
    <div>
      <input type="text" name="summary" class="form-control" placeholder="Enter the Zone Summary" value="{[=it.summary]}">
    </div>
  </div>

  <div class="l4i-form-group">
    <label>Action</label>
    <div>
      {[~it._actions :v]}
        <span class="ids-form-checkbox">
          <input type="radio" name="phase" value="{[=v.action]}" {[ if (v.action == it.phase) { ]}checked="checked"{[ } ]}> {[=v.title]}
        </span>
      {[~]}
    </div>
  </div>

  <div class="l4i-form-group">
    <label>
      <span>WAN Addresss</span>
      <button type="button" class="btn btn-default btn-sm" 
        onclick="inOpsHost.ZoneWanAddressAppend()">
        <span class="fa fa-plus"></span> &nbsp; Add new Address
      </button>
    </label>
    <div>
      <table width="100%" class="table">
        <thead>
        <tr>
          <th>Address</th>
          <th></th>
        </tr>
        </thead>
        <tbody id="inops-host-zoneset-wanaddrs">
          {[~it.wan_addrs :vaddr]}
          <tr class="inops-host-zoneset-wanaddr-item">
            <td><input name="wan_addr" type="text" value="{[=vaddr]}" class="form-control form-control-sm"/></td>
            <td align="right">
              <button class="btn btn-sm" onclick="inOpsHost.ZoneWanAddressDel(this)">
                Delete
              </button>
            </td>
          </tr>
          {[~]}
        </tbody>
      </table>
    </div>
  </div>

  <div class="l4i-form-group">
    <label>
      <span>LAN Addresss</span>
      <button type="button" class="btn btn-default btn-sm" 
        onclick="inOpsHost.ZoneLanAddressAppend()">
        <span class="fa fa-plus"></span> &nbsp; Add new Address
      </button>
    </label>
    <div>
      <table width="100%" class="table">
        <thead>
        <tr>
          <th>Address</th>
          <th></th>
        </tr>
        </thead>
        <tbody id="inops-host-zoneset-lanaddrs">
          {[~it.lan_addrs :vaddr]}
          <tr class="inops-host-zoneset-lanaddr-item">
            <td><input name="lan_addr" type="text" value="{[=vaddr]}" class="form-control form-control-sm"/></td>
            <td align="right">
              <button class="btn btn-sm " onclick="inOpsHost.ZoneLanAddressDel(this)">
                Delete
              </button>
            </td>
          </tr>
          {[~]}
        </tbody>
      </table>
    </div>
  </div>

  <div class="l4i-form-group">
    <label class="">API</label>
    <div>
      <input type="text" name="wan_api" class="form-control" placeholder="Enter the Zone API" value="{[=it.wan_api]}">
    </div>
  </div>

</div>

<script id="inops-host-zoneset-wanaddr-tpl" type="text/html">
<tr class="inops-host-zoneset-wanaddr-item">
  <td><input name="wan_addr" type="text" value="" class="form-control form-control-sm"/></td>
  <td align="right"><button class="btn btn-sm " onclick="inOpsHost.ZoneWanAddressDel(this)">Delete</button></td>
</tr>
</script>

<script id="inops-host-zoneset-lanaddr-tpl" type="text/html">
<tr class="inops-host-zoneset-lanaddr-item">
  <td><input name="lan_addr" type="text" value="" class="form-control form-control-sm"/></td>
  <td align="right"><button class="btn btn-sm " onclick="inOpsHost.ZoneLanAddressDel(this)">Delete</button></td>
</tr>
</script>

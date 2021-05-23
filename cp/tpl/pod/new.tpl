<style>
  .less-modal-body-pagelet #incp-podnew-form {
    padding-left: 4px;
  }
  #incp-podnew-form .btn-sm {
    padding: 3px 10px;
    font-size: 12px;
    line-height: 120%;
  }
  #incp-podnew-form button.icon-x20 {
    padding: 0px;
    width: 22px;
    height: 22px;
    font-size: 11px;
    text-align: center;
  }
</style>
<div id="incp-podnew-alert"></div>
<div id="incp-podnew-form"></div>

<script type="text/html" id="incp-podnew-inner">
  <div class="card incp-div-light">
    <div class="card-header">New Pod Instance</div>
    <div class="card-body">
      <table class="incp-formtable">
        <tbody>
          {[? it._options.user_groups]}
          <tr>
            <td width="260px">Owner</td>
            <td>
              <select
                name="incp-podnew-meta-user"
                id="incp-podnew-meta-user"
                class="form-control"
              >
                {[~it._options.user_groups :v]}
                <option value="{[=v]}">{[=v]}</option>
                {[~]}
              </select>
            </td>
          </tr>
          {[?]}

          <tr>
            <td width="180px">Name</td>
            <td>
              <input
                type="text"
                class="form-control"
                id="incp-podnew-meta-name"
                value=""
              />
            </td>
          </tr>

          <tr id="incp-podnew-plan-row">
            <td>Plan</td>
            <td
              id="incp-podnew-plans"
              class="incp-form-box-selector"
              style="padding-bottom: 0"
            ></td>
          </tr>

          <tr>
            <td>Cost of running</td>
            <td>
              <div id="incp-podnew-charge-estimate-value"></div>
            </td>
          </tr>

          <tr>
            <td></td>
            <td>
              <button
                type="button"
                class="btn btn-primary"
                onclick="inCpPod.NewCommit()"
              >
                Save
              </button>

              <button
                type="button"
                class="btn btn-default"
                onclick="inCpPod.List()"
                style="margin-left:10px"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</script>

<script type="text/html" id="incp-podnew-modal">
  <table class="incp-formtable">
    <tbody>
      <tr>
        <td width="180px">Name</td>
        <td>
          <input
            type="text"
            class="form-control"
            id="incp-podnew-meta-name"
            value=""
          />
        </td>
      </tr>

      <tr id="incp-podnew-plan-row">
        <td>Plan</td>
        <td
          id="incp-podnew-plans"
          class="incp-form-box-selector"
          style="padding-bottom: 0"
        ></td>
      </tr>

      <tr>
        <td></td>
        <td>
          <div
            id="incp-podnew-charge-estimate-value"
            class="font-size:30px"
          ></div>
        </td>
      </tr>
    </tbody>
  </table>
</script>

<script type="text/html" id="incp-podnew-plans-tpl">
  {[~it.items :v]}
  <span
    class="incp-form-box-selector-item {[if (v.meta.id == it._plan_selected) { ]}selected{[ } ]}"
    id="incp-podnew-plan-id-{[=v.meta.id]}"
    onclick="inCpPod.NewPlanChange('{[=v.meta.id]}')"
  >
    <span>{[=v.meta.name]}</span>
  </span>
  {[~]}
</script>

<script type="text/html" id="incp-podnew-resource-selector-tpl">
  <tr class="incp-podnew-resource-selector-row">
    <td>Zone / Cluster</td>
    <td
      class="incp-form-box-selector"
      id="incp-podnew-zones"
      style="padding-bottom:0"
    >
      {[~it._zones :v]}
      <div
        class="incp-form-box-selector-item {[if (v.name == it._zone_selected) { ]}selected{[ } ]}"
        id="incp-podnew-zone-id-{[=v.id]}"
        onclick="inCpPod.NewPlanClusterChange('{[=v.name]}')"
      >
        <div>{[=v.zone_title]}</div>
        <div>{[=v.cell_title]}</div>
      </div>
      {[~]}
    </td>
  </tr>

  <tr class="incp-podnew-resource-selector-row">
    <td>CPU / RAM</td>
    <td
      class="incp-form-box-selector"
      id="incp-podnew-res-computes"
      style="padding-bottom:0"
    >
      {[~it.res_computes :v]}
      <div
        class="incp-font-fixspace incp-form-box-selector-item {[if (!inCpPod.NewOptionResFit(v)) {]}disable{[} else if (v.ref_id == it.res_compute_selected) { ]}selected{[ } ]}"
        id="incp-podnew-res-compute-id-{[=v.ref_id]}"
        onclick="inCpPod.NewPlanResComputeChange('{[=v.ref_id]}')"
      >
        <div>CPU: {[=v._cpu_limit]}</div>
        <div>RAM: {[=v._mem_limit]}</div>
        <span class="disable_close">&times;</span>
      </div>
      {[~]}
    </td>
  </tr>

  <tr class="incp-podnew-resource-selector-row">
    <td>Image</td>
    <td
      class="incp-form-box-selector"
      id="incp-podnew-images"
      style="padding-bottom:0"
    >
      {[? it._options.app_runtime_images &&
      it._options.app_runtime_images.length > 0]}
      {[~it._options.app_runtime_images :ref_id]}
      <div
        class="incp-form-box-selector-item"
        id="incp-podnew-image-id-{[=valueui.utilx.cryptoMd5(ref_id)]}"
        onclick="inCpPod.NewPlanImageChange('{[=ref_id]}')"
      >
        <div>{[=ref_id]}</div>
      </div>
      {[~]} {[??]} {[~it.images :v]}
      <div
        class="incp-form-box-selector-item {[if (v.ref_id == it.image_selected) { ]}selected{[ } ]}"
        id="incp-podnew-image-id-{[=valueui.utilx.cryptoMd5(v.ref_id)]}"
        onclick="inCpPod.NewPlanImageChange('{[=v.ref_id]}')"
      >
        <div>{[? v.ref_title]}{[=v.ref_title]} / {[?]}{[=v.driver]}</div>
        <div>{[=v.ref_id]}</div>
      </div>
      {[~]} {[?]}
      <div
        class="incp-form-box-selector-item"
        id="incp-podnew-image-id-oci-name"
        onclick="inCpPod.NewPlanImageChange('oci-name')"
      >
        <div style="font-size: 90%">Custom Image Name</div>
        <div style="padding:0;">
          <input
            id="incp-podnew-image-oci-name"
            class="form-control form-control-sm"
            style="padding: 2px 0.25rem;line-height:100%;"
            value=""
          />
        </div>
      </div>
    </td>
  </tr>

  <tr class="incp-podnew-resource-selector-row">
    <td>System Storage</td>
    <td id="incp-podnew-vols">
      <div class="incp-form-box-selector">
        {[~it.res_volumes :v]}
        <div
          class="incp-form-box-selector-item {[if (v.ref_id == it._res_volume.ref_id) { ]}selected{[ } ]}"
          id="incp-podnew-vol-id-{[=v.ref_id]}"
          onclick="inCpPod.NewPlanVolChange('{[=v.ref_id]}')"
        >
          <div>{[=v.ref_id]}</div>
          <div>{[=v.ref_name]}</div>
        </div>
        {[~]}
      </div>

      <div class="">
        <table class="incp-formtable">
          <tr>
            <td width="" valign="top">
              <strong>Size</strong>
              <div
                class="form incp-form-box-selector-item-frame"
                id="incp-podnew-res-volumes"
              >
                <div class="input-group" style="">
                  <input
                    type="text"
                    class="form-control"
                    id="incp-podnew-resource-value"
                    value="{[=it._res_volume._valued]}"
                    oninput="inCpPod.HookAccountChargeRefresh()"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">GB</div>
                  </div>
                </div>
                <div
                  class="form-text text-muted"
                  id="incp-podnew-resource-hint"
                >
                  Range: {[=it._res_volume.request]} ~ {[=it._res_volume.limit]}
                  GB
                </div>
              </div>
            </td>
            <td valign="top">
              <strong
                >Mounts
                <button
                  class="btn btn-default icon-x20"
                  onclick="inCpPod.SpecMountAppend()"
                >
                  <i class="fa fa-plus"></i></button
              ></strong>
              <table class="">
                <tbody id="incp-pod-set-spec-mounts">
                  <tr>
                    <td>Source</td>
                    <td>Target</td>
                  </tr>
                  {[~it._spec_mounts :v]}
                  <tr class="incp-pod-set-spec-mount-item">
                    <td>
                      <input class="form-control form-control-sm" name="source"
                      value="{[=v.source]}" style="min-width:300px" {[?
                      v.default === true]} readonly{[?]} />
                    </td>
                    <td>
                      <input class="form-control form-control-sm" name="target"
                      value="{[=v.target]}" style="min-width:150px" {[?
                      v.default === true]} readonly{[?]} />
                    </td>
                    <td align="right">
                      {[? v.default !== true]}
                      <button
                        class="btn btn-default icon-x20"
                        onclick="inCpPod.SpecMountDel(this)"
                      >
                        <i class="fa fa-times"></i>
                      </button>
                      {[?]}
                    </td>
                  </tr>
                  {[~]}
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </td>
  </tr>
</script>

<script type="text/html" id="incp-pod-set-spec-mount-item-tpl">
<tr class="incp-pod-set-spec-mount-item">
  <td>
    <input class="form-control form-control-sm" name="source"
    value="{[=it.source]}" style="min-width:300px" {[?
      it.default === true]} readonly{[?]} />
  </td>
  <td>
    <input class="form-control form-control-sm" name="target"
    value="{[=it.target]}" style="min-width:150px" {[?
      it.default === true]} readonly{[?]} />
  </td>
  <td align="right">
    {[? it.default !== true]}
    <button
      class="btn btn-default icon-x20"
      onclick="inCpPod.SpecMountDel(this)"
    >
      <i class="fa fa-times"></i>
    </button>
    {[?]}
  </td>
</tr>
</script>
